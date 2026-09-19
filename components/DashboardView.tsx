'use client';

import HeaderBox, { MetricCard } from '@/components/HeaderBox';
import SecurityBadges from '@/components/SecurityBadges';
import { DashboardSkeleton } from '@/components/Skeletons';
import EmptyState from '@/components/EmptyState';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import DoughnutChart from '@/components/DoughnutChart';
import { CategoryIcon, StatusBadge } from '@/components/TransactionMeta';
import { useFinance } from '@/lib/finance-context';
import { MONTH_LABEL, formatSignedAmount } from '@/lib/finance-utils';
import { useSimulatedLoading } from '@/lib/use-simulated-loading';
import { formatAmount, formatDateTime } from '@/lib/utils';
import { Landmark } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const DashboardView = () => {
  const router = useRouter();
  const loading = useSimulatedLoading();
  const { banks, transactions, totalBalance, monthlyIncome, monthlySpending, kyc } =
    useFinance();

  if (loading) return <DashboardSkeleton />;

  const chartAccounts = banks.map((bank) => ({
    id: bank.id,
    availableBalance: bank.balance.available,
    currentBalance: bank.balance.current,
    officialName: bank.accountName,
    mask: bank.lastFour,
    institutionId: bank.id,
    name: bank.shortName,
    type: bank.accountType,
    subtype: bank.accountType,
    appwriteItemId: bank.id,
    sharableId: bank.id,
  }));

  const recent = transactions.slice(0, 6);

  return (
    <section className="page-shell">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <HeaderBox
            type="greeting"
            title="Welcome,"
            user={kyc.preferredName}
            subtext="Unified Naira balances, NIP activity, and spending across every linked Nigerian bank."
          />
          <SecurityBadges className="hidden sm:flex" />
        </div>
        <Link
          href="/payment-transfer"
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-forest text-sm font-semibold text-sage md:hidden dark:bg-sage dark:text-forest"
        >
          Send money
        </Link>

        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            label="Total net balance"
            value={<AnimatedCounter amount={totalBalance} />}
            hint="Across all linked Naira accounts"
            trend="neutral"
          />
          <MetricCard
            label="Monthly income"
            value={<AnimatedCounter amount={monthlyIncome} />}
            hint={`${MONTH_LABEL} credits`}
            trend="up"
          />
          <MetricCard
            label="Monthly spending"
            value={<AnimatedCounter amount={monthlySpending} />}
            hint={`${MONTH_LABEL} debits`}
            trend="down"
          />
          <MetricCard
            label="Linked banks"
            value={banks.length}
            hint={
              banks.length
                ? 'Manage linked accounts'
                : 'Link a bank to get started'
            }
            trend="neutral"
            href="/my-banks"
          />
        </div>

        {banks.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No accounts connected"
            description="Link a CBN-licensed bank or MFB via Open Banking to start aggregating Naira balances."
            actionLabel="Link a bank account"
            onAction={() => router.push('/my-banks')}
          />
        ) : (
          <>
          <AnalyticsPanel />
          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <article className="surface-card p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold">Recent transactions</h2>
                  <p className="text-sm text-muted-foreground">
                    Latest activity across all linked banks
                  </p>
                </div>
                <Link
                  href="/transaction-history"
                  className="text-sm font-semibold text-forest dark:text-sage"
                >
                  View all
                </Link>
              </div>
              <div className="space-y-3">
                {recent.map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center gap-3 rounded-xl border border-transparent px-1 py-2.5 sm:px-2 transition hover:border-border hover:bg-muted/40"
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage text-forest dark:bg-forest dark:text-sage">
                      <CategoryIcon name={tx.merchant.icon} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{tx.merchant.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {formatDateTime(new Date(tx.timestamp)).dateTime} · {tx.bankName}
                      </p>
                    </div>
                    <div className="hidden sm:block">
                      <StatusBadge status={tx.status} />
                    </div>
                    <p
                      className={`shrink-0 text-right text-sm font-semibold ${
                        tx.amount > 0
                          ? 'text-success'
                          : 'text-foreground'
                      }`}
                    >
                      {formatSignedAmount(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-card p-6">
              <h2 className="text-lg font-semibold">Balance allocation</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                How deposits are split across institutions
              </p>
              <div className="mx-auto size-44">
                <DoughnutChart accounts={chartAccounts} />
              </div>
              <ul className="mt-6 space-y-3">
                {banks.map((bank) => (
                  <li key={bank.id} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span
                        className="size-2.5 rounded-full"
                        style={{ backgroundColor: bank.colorTheme }}
                      />
                      {bank.shortName}
                    </span>
                    <span className="font-medium">
                      {formatAmount(bank.balance.current)}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </div>
          </>
        )}
    </section>
  );
};

export default DashboardView;

const AnalyticsPanel = () => {
  const { monthlyIncome, monthlySpending, transactions } = useFinance();
  const max = Math.max(monthlyIncome, monthlySpending, 1);
  const categories = transactions
    .filter((tx) => tx.type === 'debit' && tx.status !== 'failed')
    .reduce<Record<string, number>>((acc, tx) => {
      acc[tx.merchant.category] =
        (acc[tx.merchant.category] || 0) + Math.abs(tx.amount);
      return acc;
    }, {});
  const ranked = Object.entries(categories)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <article className="surface-card p-6">
      <h2 className="text-lg font-semibold">Unified cash-flow analytics</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Income vs spending across every linked commercial bank, MFB, and wallet
        in Nigeria.
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Income
          </p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-forest dark:bg-sage"
              style={{ width: `${(monthlyIncome / max) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold">{formatAmount(monthlyIncome)}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Spending
          </p>
          <div className="mt-2 h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-[#DD4B39]"
              style={{ width: `${(monthlySpending / max) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm font-semibold">
            {formatAmount(monthlySpending)}
          </p>
        </div>
      </div>
      <ul className="mt-6 space-y-3">
        {ranked.map(([name, value]) => (
          <li key={name} className="flex items-center justify-between text-sm">
            <span>{name}</span>
            <span className="font-medium">{formatAmount(value)}</span>
          </li>
        ))}
      </ul>
    </article>
  );
};
