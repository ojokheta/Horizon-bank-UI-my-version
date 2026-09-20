'use client';

import HeaderBox from '@/components/HeaderBox';
import SecurityBadges from '@/components/SecurityBadges';
import { TableSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import { useFinance } from '@/lib/finance-context';
import { copyText } from '@/lib/finance-utils';
import { useToast } from '@/lib/toast';
import { useSimulatedLoading } from '@/lib/use-simulated-loading';
import { formatAmount } from '@/lib/utils';
import { Check, Copy, Link2, Qr } from 'reicon-react';
import { useMemo, useState } from 'react';

const ReceiveMoneyPage = () => {
  const loading = useSimulatedLoading();
  const { kyc, banks } = useFinance();
  const { toast } = useToast();
  const [copied, setCopied] = useState<string | null>(null);
  const paymentLink = `https://pay.horizon.ng/${kyc.tag.replace('@', '')}`;

  const modules = useMemo(() => {
    const seed = `${kyc.virtualNuban}${kyc.virtualBankCode}`;
    return Array.from({ length: 21 * 21 }, (_, index) => {
      const row = Math.floor(index / 21);
      const col = index % 21;
      const finder =
        (row < 7 && col < 7) ||
        (row < 7 && col > 13) ||
        (row > 13 && col < 7);
      if (finder) {
        const inFinder =
          row % 20 < 7 &&
          ((row < 7 && col < 7) ||
            (row < 7 && col > 13) ||
            (row > 13 && col < 7));
        const ring = [0, 6].includes(row % 7) || [0, 6].includes(col % 7);
        const center = row % 7 > 1 && row % 7 < 5 && col % 7 > 1 && col % 7 < 5;
        return inFinder && (ring || center);
      }
      const code = seed.charCodeAt(index % seed.length);
      return (code + row * col) % 3 !== 0;
    });
  }, [kyc.virtualBankCode, kyc.virtualNuban]);

  const copy = async (label: string, value: string) => {
    await copyText(value);
    setCopied(label);
    toast({ title: 'Copied', description: `${label} copied to clipboard.` });
    window.setTimeout(() => setCopied(null), 1600);
  };

  if (loading) return <TableSkeleton />;

  return (
    <section className="page-shell">
      <HeaderBox
        title="Receive Money"
        subtext="Share your Horizon virtual NUBAN, payment link, or QR. Incoming NIP credits any linked account."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="surface-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            Dedicated virtual NUBAN
          </p>
          <h2 className="mt-2 font-ibm-plex-serif text-3xl tracking-wide">
            {kyc.virtualNuban}
          </h2>
          <p className="mt-2 text-sm">
            {kyc.virtualBankName} · {kyc.virtualBankCode}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{kyc.legalName}</p>

          <div className="mt-6 grid gap-2">
            <CopyRow
              label="Account number"
              value={kyc.virtualNuban}
              copied={copied === 'Account number'}
              onCopy={() => copy('Account number', kyc.virtualNuban)}
            />
            <CopyRow
              label="Bank"
              value={`${kyc.virtualBankName} (${kyc.virtualBankCode})`}
              copied={copied === 'Bank'}
              onCopy={() =>
                copy('Bank', `${kyc.virtualBankName} ${kyc.virtualBankCode}`)
              }
            />
            <CopyRow
              label="Account name"
              value={kyc.legalName}
              copied={copied === 'Account name'}
              onCopy={() => copy('Account name', kyc.legalName)}
            />
            <CopyRow
              label="Payment link"
              value={paymentLink}
              copied={copied === 'Payment link'}
              onCopy={() => copy('Payment link', paymentLink)}
            />
          </div>
        </article>

        <article className="surface-card p-6">
          <div className="flex items-center gap-2">
            <Qr className="size-5 text-forest dark:text-sage" />
            <h2 className="text-lg font-semibold">Scan to pay</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Dynamic Horizon Pay QR · NIP to {kyc.virtualNuban}
          </p>
          <div className="mx-auto mt-6 w-fit rounded-2xl border border-border bg-white p-4">
            <div
              className="grid gap-[2px]"
              style={{ gridTemplateColumns: 'repeat(21, 8px)' }}
            >
              {modules.map((on, index) => (
                <span
                  key={index}
                  className={on ? 'size-2 bg-[#121A15]' : 'size-2 bg-white'}
                />
              ))}
            </div>
          </div>
          <Button
            className="mt-6 w-full"
            variant="outline"
            onClick={() => copy('Payment link', paymentLink)}
          >
            <Link2 className="mr-2 size-4" />
            Copy shareable payment link
          </Button>
        </article>
      </div>

      <article className="surface-card p-6">
        <h2 className="text-lg font-semibold">Receive into a linked bank</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share any of your connected NUBANs. Primary deposit account is marked.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {banks.map((bank) => (
            <div
              key={bank.id}
              className="flex items-center justify-between rounded-2xl border border-border px-4 py-3"
            >
              <div>
                <p className="font-medium">
                  {bank.shortName}
                  {bank.isPrimary ? ' · Primary' : ''}
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  {bank.accountNumber}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatAmount(bank.balance.current)}
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  copy(`${bank.shortName} NUBAN`, bank.accountNumber)
                }
              >
                Copy
              </Button>
            </div>
          ))}
        </div>
      </article>

      <SecurityBadges />
    </section>
  );
};

const CopyRow = ({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) => (
  <button
    type="button"
    onClick={onCopy}
    className="flex w-full items-center justify-between gap-3 rounded-xl border border-border px-3 py-2 text-left hover:bg-muted/40"
  >
    <span>
      <span className="block text-[11px] uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium">{value}</span>
    </span>
    {copied ? <Check className="size-4 text-success" /> : <Copy className="size-4" />}
  </button>
);

export default ReceiveMoneyPage;
