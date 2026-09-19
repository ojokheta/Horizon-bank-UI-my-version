'use client';

import BankAccountCard, {
  AddBankCard,
  BanksEmpty,
} from '@/components/BankAccountCard';
import HeaderBox from '@/components/HeaderBox';
import LinkBankSheet from '@/components/LinkBankSheet';
import SecurityBadges from '@/components/SecurityBadges';
import { CardsSkeleton } from '@/components/Skeletons';
import { useFinance } from '@/lib/finance-context';
import { formatAmount } from '@/lib/utils';
import { useSimulatedLoading } from '@/lib/use-simulated-loading';
import { useState } from 'react';

const MyBanksPage = () => {
  const loading = useSimulatedLoading();
  const { banks, totalBalance } = useFinance();
  const [open, setOpen] = useState(false);

  if (loading) return <CardsSkeleton />;

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <HeaderBox
          title="My Banks"
          subtext="Open Banking aggregation across GTBank, Access, Zenith, Kuda, OPay, and other CBN-licensed institutions."
        />
        <div className="flex flex-col items-start gap-3 lg:items-end">
          <p className="text-sm text-muted-foreground">
            Combined available:{' '}
            <span className="font-semibold text-foreground">
              {formatAmount(totalBalance)}
            </span>
          </p>
          <SecurityBadges />
        </div>
      </div>

      {banks.length === 0 ? (
        <BanksEmpty onAdd={() => setOpen(true)} />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {banks.map((bank) => (
            <BankAccountCard key={bank.id} bank={bank} />
          ))}
          <AddBankCard onClick={() => setOpen(true)} />
        </div>
      )}

      <LinkBankSheet open={open} onOpenChange={setOpen} />
    </section>
  );
};

export default MyBanksPage;
