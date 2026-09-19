'use client';

import EmptyState from '@/components/EmptyState';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import BankMark from '@/components/BankMark';
import { useFinance } from '@/lib/finance-context';
import { copyText } from '@/lib/finance-utils';
import { accountTypeLabel } from '@/lib/nigeria';
import { useToast } from '@/lib/toast';
import { formatAmount } from '@/lib/utils';
import type { BankAccount } from '@/types/finance';
import { ArrowLeftRight, Copy, FileText, Star, Unlink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const BankAccountCard = ({ bank }: { bank: BankAccount }) => {
  const router = useRouter();
  const { unlinkBank, setPrimaryBank } = useFinance();
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const copyAccount = async () => {
    await copyText(bank.accountNumber);
    toast({
      title: 'NUBAN copied',
      description: `${bank.shortName} ${bank.accountNumber} is on your clipboard.`,
    });
  };

  return (
    <article className="surface-card flex flex-col overflow-hidden">
      <div
        className="relative min-h-[150px] p-5 text-white"
        style={{
          background: `linear-gradient(135deg, ${bank.colorTheme} 0%, #121A15 100%)`,
        }}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-widest text-white/80">
              {bank.shortName} · {bank.bankCode}
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-snug">
              {accountTypeLabel(bank.accountType)}
            </h3>
          </div>
          {bank.isPrimary ? (
            <span className="rounded-full bg-sage px-2.5 py-1 text-[11px] font-semibold text-forest">
              Primary deposit
            </span>
          ) : null}
        </div>
        <div className="mt-8 flex items-end justify-between gap-3">
          <p className="font-ibm-plex-serif text-2xl">
            {formatAmount(bank.balance.current)}
          </p>
          <p className="font-mono text-sm tracking-wide text-white/90">
            {bank.accountNumber}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <BankMark name={bank.shortName} color={bank.colorTheme} code={bank.bankCode} />
          <span className="text-[11px] font-medium uppercase tracking-wide text-success">
            {bank.connectionStatus}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Account name</p>
            <p className="mt-1 text-xs font-medium leading-snug">{bank.accountName}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Available</p>
            <p className="mt-1 font-medium">
              {formatAmount(bank.balance.available)}
            </p>
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/payment-transfer?from=${bank.id}`)}
          >
            <ArrowLeftRight className="mr-1 size-3.5" />
            Transfer
          </Button>
          <Button variant="outline" size="sm" onClick={copyAccount}>
            <Copy className="mr-1 size-3.5" />
            Copy NUBAN
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast({
                title: 'Statement ready',
                description: `A WAT-dated PDF for ${bank.shortName} is being prepared.`,
                tone: 'info',
              })
            }
          >
            <FileText className="mr-1 size-3.5" />
            Statement
          </Button>
          {bank.isPrimary ? (
            <Button variant="outline" size="sm" onClick={() => setConfirmOpen(true)}>
              <Unlink className="mr-1 size-3.5" />
              Unlink
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setPrimaryBank(bank.id)}>
              <Star className="mr-1 size-3.5" />
              Make primary
            </Button>
          )}
        </div>
        {!bank.isPrimary ? (
          <button
            type="button"
            className="text-xs text-muted-foreground underline-offset-2 hover:underline"
            onClick={() => setConfirmOpen(true)}
          >
            Unlink this bank
          </button>
        ) : null}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlink {bank.shortName}?</DialogTitle>
            <DialogDescription>
              This revokes the Open Banking consent for {bank.institutionName}.
              You can reconnect through Mono/Okra at any time.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Keep linked
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                unlinkBank(bank.id);
                setConfirmOpen(false);
              }}
            >
              Unlink bank
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </article>
  );
};

export const AddBankCard = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-forest/40 bg-sage/30 p-6 text-center transition hover:border-forest hover:bg-sage/60 dark:border-sage/30 dark:bg-card dark:hover:border-sage"
    >
      <span className="mb-3 flex size-12 items-center justify-center rounded-full bg-forest text-2xl text-sage dark:bg-sage dark:text-forest">
        +
      </span>
      <p className="text-lg font-semibold">Link a Nigerian bank</p>
      <p className="mt-1 max-w-xs text-sm text-muted-foreground">
        Connect GTBank, Access, Zenith, Kuda, OPay and more via Open Banking.
      </p>
    </button>
  );
};

export const BanksEmpty = ({ onAdd }: { onAdd: () => void }) => (
  <EmptyState
    title="No Nigerian banks linked yet"
    description="Link a commercial bank or MFB to start aggregating balances, NIP transfers, and spending insights."
    actionLabel="Link a bank account"
    onAction={onAdd}
  />
);

export default BankAccountCard;
