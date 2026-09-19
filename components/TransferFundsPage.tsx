'use client';

import EmptyState from '@/components/EmptyState';
import HeaderBox from '@/components/HeaderBox';
import SecurityBadges from '@/components/SecurityBadges';
import { TableSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFinance } from '@/lib/finance-context';
import { kycTiers, nipFee, nigerianBanks, resolveNubanName, resolveTagOrPhone } from '@/lib/nigeria';
import { useToast } from '@/lib/toast';
import { useSimulatedLoading } from '@/lib/use-simulated-loading';
import { cn, formatAmount } from '@/lib/utils';
import type { DestinationType, TransferPayload } from '@/types/finance';
import { CheckCircle2, Landmark, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

const PRESETS = [1000, 5000, 25000];

const TransferFundsPage = ({ initialSource }: { initialSource?: string }) => {
  const router = useRouter();
  const loading = useSimulatedLoading();
  const { toast } = useToast();
  const { banks, kyc, dailySent, submitTransfer } = useFinance();
  const defaultSource =
    banks.find((bank) => bank.id === initialSource)?.id ||
    banks.find((bank) => bank.isPrimary)?.id ||
    banks[0]?.id ||
    '';

  const [sourceAccountId, setSourceAccountId] = useState(defaultSource);
  const [destinationType, setDestinationType] = useState<DestinationType>('nuban');
  const [destinationBankId, setDestinationBankId] = useState(
    banks.find((bank) => bank.id !== defaultSource)?.id || ''
  );
  const [nubanBankCode, setNubanBankCode] = useState('033');
  const [accountNumber, setAccountNumber] = useState('2098765432');
  const [resolvedName, setResolvedName] = useState<string | null>('ADAMU BELLO SANI');
  const [lookupState, setLookupState] = useState<'idle' | 'loading' | 'ready'>('ready');
  const [tagOrPhone, setTagOrPhone] = useState('@adamu');
  const [amount, setAmount] = useState('25000');
  const [narration, setNarration] = useState('Project milestone payment');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [receipt, setReceipt] = useState<{
    id: string;
    arrival: string;
    payload: TransferPayload;
  } | null>(null);

  const source = banks.find((bank) => bank.id === sourceAccountId);
  const destinationBank = banks.find((bank) => bank.id === destinationBankId);
  const parsedAmount = Number(amount) || 0;
  const fee = nipFee(parsedAmount, destinationType);
  const remainingLimit = Math.max(0, kyc.dailyLimit - dailySent);
  const nubanBank = nigerianBanks.find((bank) => bank.bankCode === nubanBankCode);
  const tagMatch = resolveTagOrPhone(tagOrPhone);

  useEffect(() => {
    if (destinationType !== 'nuban') return;
    if (!/^\d{10}$/.test(accountNumber) || !nubanBankCode) {
      setResolvedName(null);
      setLookupState('idle');
      return;
    }

    setLookupState('loading');
    const timeout = window.setTimeout(() => {
      setResolvedName(resolveNubanName(nubanBankCode, accountNumber));
      setLookupState('ready');
    }, 450);

    return () => window.clearTimeout(timeout);
  }, [accountNumber, destinationType, nubanBankCode]);

  const destinationLabel = useMemo(() => {
    if (destinationType === 'self') {
      return `${destinationBank?.shortName ?? ''} · ${destinationBank?.accountNumber ?? ''}`;
    }
    if (destinationType === 'tag') {
      return tagMatch
        ? `${tagMatch.name} · ${tagMatch.bankName}`
        : 'Unknown tag or phone';
    }
    return resolvedName
      ? `${resolvedName} · ${nubanBank?.shortName ?? ''} ${accountNumber}`
      : 'Enter a valid 10-digit NUBAN';
  }, [
    destinationType,
    destinationBank,
    tagMatch,
    resolvedName,
    nubanBank,
    accountNumber,
  ]);

  const payload: TransferPayload = {
    sourceAccountId,
    destination:
      destinationType === 'self'
        ? {
            type: 'self',
            bankId: destinationBankId,
            resolvedAccountName: destinationBank?.accountName,
            bankName: destinationBank?.institutionName,
            bankCode: destinationBank?.bankCode,
            accountNumber: destinationBank?.accountNumber,
          }
        : destinationType === 'tag'
          ? {
              type: 'tag',
              tagOrPhone,
              resolvedAccountName: tagMatch?.name,
              bankCode: tagMatch?.bankCode,
              bankName: tagMatch?.bankName,
              accountNumber: tagMatch?.accountNumber,
            }
          : {
              type: 'nuban',
              bankCode: nubanBankCode,
              bankName: nubanBank?.name,
              accountNumber,
              resolvedAccountName: resolvedName ?? undefined,
            },
    amount: parsedAmount,
    currency: 'NGN',
    narration,
    fee,
  };

  const canContinue =
    !!source &&
    parsedAmount > 0 &&
    parsedAmount <= (source.balance.available || 0) &&
    parsedAmount <= remainingLimit &&
    (destinationType === 'self'
      ? !!destinationBank && destinationBank.id !== source.id
      : destinationType === 'tag'
        ? !!tagMatch
        : lookupState === 'ready' && !!resolvedName);

  if (loading) return <TableSkeleton />;

  if (banks.length === 0) {
    return (
      <section className="page-shell">
        <HeaderBox
          title="Send Money"
          subtext="Move Naira between your banks, to any NUBAN, or via tag/phone."
        />
        <EmptyState
          icon={Landmark}
          title="Link a bank to send Naira"
          description="Connect a CBN-licensed bank or MFB to start NIP transfers."
          actionLabel="Link a bank account"
          onAction={() => router.push('/my-banks')}
        />
      </section>
    );
  }

  if (receipt) {
    return (
      <section className="page-shell max-w-3xl">
        <div className="surface-card overflow-hidden">
          <div className="bg-sage px-6 py-8 text-center dark:bg-forest">
            <CheckCircle2 className="mx-auto size-12 text-forest dark:text-sage" />
            <h1 className="mt-4 text-2xl font-semibold text-forest dark:text-sage">
              NIP transfer sent
            </h1>
            <p className="mt-2 text-sm text-forest/80 dark:text-sage/80">
              Receipt {receipt.id}
            </p>
          </div>
          <div className="space-y-4 p-6">
            <Row label="Amount" value={formatAmount(receipt.payload.amount)} />
            <Row
              label="From"
              value={
                banks.find((bank) => bank.id === receipt.payload.sourceAccountId)
                  ?.shortName ?? 'Source account'
              }
            />
            <Row
              label="To"
              value={receipt.payload.destination.resolvedAccountName || 'Recipient'}
            />
            <Row
              label="NUBAN"
              value={receipt.payload.destination.accountNumber || '—'}
            />
            <Row label="Narration" value={receipt.payload.narration || '—'} />
            <Row label="Fee" value={formatAmount(receipt.payload.fee)} />
            <Row label="Arrival" value={receipt.arrival} />
            <SecurityBadges className="pt-2" />
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild>
                <Link href="/transaction-history">View activity</Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setReceipt(null);
                  setAmount('25000');
                }}
              >
                Send another
              </Button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <HeaderBox
        title="Send Money"
        subtext="NIBSS Instant Payments across your linked banks, any NUBAN, or Horizon tag/phone."
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <form
          className="surface-card space-y-6 p-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (canContinue) setConfirmOpen(true);
          }}
        >
          <ol className="grid grid-cols-3 gap-2 text-xs font-semibold uppercase tracking-wide">
            {['Details', 'Confirm', 'Receipt'].map((step, index) => (
              <li
                key={step}
                className={cn(
                  'rounded-full px-3 py-2 text-center',
                  index === 0
                    ? 'bg-forest text-sage dark:bg-sage dark:text-forest'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {index + 1}. {step}
              </li>
            ))}
          </ol>

          <div className="space-y-2">
            <Label htmlFor="source">Source account</Label>
            <select
              id="source"
              className="horizon-select w-full"
              value={sourceAccountId}
              onChange={(event) => {
                setSourceAccountId(event.target.value);
                if (event.target.value === destinationBankId) {
                  const next = banks.find((bank) => bank.id !== event.target.value);
                  setDestinationBankId(next?.id || '');
                }
              }}
            >
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.shortName} · {bank.accountNumber} (
                  {formatAmount(bank.balance.available)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">Transfer channel</p>
            <div className="mb-4 grid grid-cols-3 rounded-full bg-muted p-1">
              {(
                [
                  ['self', 'Self-transfer'],
                  ['nuban', 'NUBAN direct'],
                  ['tag', 'Tag / phone'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    'rounded-full px-2 py-2 text-xs font-medium sm:text-sm',
                    destinationType === value &&
                      'bg-forest text-sage dark:bg-sage dark:text-forest'
                  )}
                  onClick={() => setDestinationType(value)}
                >
                  {label}
                </button>
              ))}
            </div>

            {destinationType === 'self' ? (
              <select
                className="horizon-select w-full"
                value={destinationBankId}
                onChange={(event) => setDestinationBankId(event.target.value)}
              >
                {banks
                  .filter((bank) => bank.id !== sourceAccountId)
                  .map((bank) => (
                    <option key={bank.id} value={bank.id}>
                      {bank.shortName} · {bank.accountNumber}
                    </option>
                  ))}
              </select>
            ) : null}

            {destinationType === 'nuban' ? (
              <div className="space-y-3">
                <select
                  className="horizon-select w-full"
                  value={nubanBankCode}
                  onChange={(event) => setNubanBankCode(event.target.value)}
                >
                  {nigerianBanks.map((bank) => (
                    <option key={bank.bankCode} value={bank.bankCode}>
                      {bank.name} · {bank.bankCode}
                    </option>
                  ))}
                </select>
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  value={accountNumber}
                  onChange={(event) =>
                    setAccountNumber(event.target.value.replace(/\D/g, '').slice(0, 10))
                  }
                  placeholder="10-digit NUBAN"
                />
                <div className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
                  {lookupState === 'loading' ? (
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" />
                      Running NIBSS name enquiry…
                    </span>
                  ) : resolvedName ? (
                    <p>
                      <span className="text-muted-foreground">Beneficiary · </span>
                      <span className="font-semibold">{resolvedName}</span>
                    </p>
                  ) : (
                    <p className="text-muted-foreground">
                      Enter 10 digits to resolve the account name.
                    </p>
                  )}
                </div>
              </div>
            ) : null}

            {destinationType === 'tag' ? (
              <div className="space-y-3">
                <Input
                  value={tagOrPhone}
                  onChange={(event) => setTagOrPhone(event.target.value)}
                  placeholder="@tag or 0803…"
                />
                <p className="text-sm text-muted-foreground">
                  {tagMatch
                    ? `Zero-fee route to ${tagMatch.name}`
                    : 'Try @adamu or 08034412290 in this demo.'}
                </p>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (NGN)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              step="0.01"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
            />
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className="rounded-full border border-border px-3 py-1.5 text-sm font-medium hover:bg-sage hover:text-forest dark:hover:bg-forest dark:hover:text-sage"
                  onClick={() => setAmount(String(parsedAmount + preset))}
                >
                  +{formatAmount(preset)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="narration">Narration</Label>
            <Input
              id="narration"
              value={narration}
              onChange={(event) => setNarration(event.target.value)}
              placeholder="What's this for?"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            {kycTiers[kyc.tier].label} remaining today:{' '}
            {formatAmount(remainingLimit)}
          </p>

          <SecurityBadges />

          <Button type="submit" disabled={!canContinue} className="w-full">
            Review NIP transfer
          </Button>
        </form>

        <aside className="surface-card h-fit p-6">
          <h2 className="text-lg font-semibold">Transfer summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <Row label="You send" value={formatAmount(parsedAmount || 0)} />
            <Row
              label="NIP fee"
              value={fee === 0 ? '₦0.00 (zero-fee)' : formatAmount(fee)}
            />
            <Row
              label="Total debit"
              value={formatAmount((parsedAmount || 0) + fee)}
            />
            <Row label="Recipient gets" value={formatAmount(parsedAmount || 0)} />
            <Row label="Estimated arrival" value="Instant · WAT" />
            <Row label="To" value={destinationLabel} />
          </div>
          {source && parsedAmount > source.balance.available ? (
            <p className="mt-4 text-sm text-destructive">
              Amount exceeds available balance of{' '}
              {formatAmount(source.balance.available)}.
            </p>
          ) : null}
          {parsedAmount > remainingLimit ? (
            <p className="mt-4 text-sm text-destructive">
              This exceeds your {kycTiers[kyc.tier].label} daily NIP limit.
            </p>
          ) : null}
        </aside>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm NIP transfer</DialogTitle>
            <DialogDescription>
              Name match is complete. Transfers settle instantly over NIBSS and
              cannot be reversed once accepted.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <Row label="Amount" value={formatAmount(parsedAmount)} />
            <Row label="From" value={source?.shortName ?? ''} />
            <Row label="To" value={destinationLabel} />
            <Row label="Fee" value={formatAmount(fee)} />
            <Row label="Narration" value={narration || '—'} />
          </div>
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Edit details
            </Button>
            <Button
              onClick={() => {
                try {
                  const result = submitTransfer(payload);
                  setConfirmOpen(false);
                  setReceipt({ ...result, payload });
                } catch (error) {
                  toast({
                    title: 'Transfer blocked',
                    description:
                      error instanceof Error ? error.message : 'Unable to send.',
                    tone: 'error',
                  });
                }
              }}
            >
              Confirm and send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-start justify-between gap-6">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-right font-medium">{value}</span>
  </div>
);

export default TransferFundsPage;
