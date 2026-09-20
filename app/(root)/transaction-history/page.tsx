'use client';

import EmptyState from '@/components/EmptyState';
import HeaderBox from '@/components/HeaderBox';
import SecurityBadges from '@/components/SecurityBadges';
import { TableSkeleton } from '@/components/Skeletons';
import {
  CategoryBadge,
  CategoryIcon,
  StatusBadge,
} from '@/components/TransactionMeta';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useFinance } from '@/lib/finance-context';
import {
  exportTransactionsCsv,
  formatSignedAmount,
  printTransactionsPdf,
} from '@/lib/finance-utils';
import { TRANSACTION_CATEGORIES } from '@/lib/mock-data';
import { useSimulatedLoading } from '@/lib/use-simulated-loading';
import { formatDateTime } from '@/lib/utils';
import type { TransactionStatus } from '@/types/finance';
import { Download, ReceiptText, Search } from 'reicon-react';
import { useMemo, useState } from 'react';

const PAGE_SIZE = 8;

const TransactionHistoryPage = () => {
  const loading = useSimulatedLoading();
  const { transactions, banks } = useFinance();
  const [query, setQuery] = useState('');
  const [range, setRange] = useState('30');
  const [bankId, setBankId] = useState('all');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const now = new Date('2026-09-19T23:59:59Z').getTime();
    const rangeMs =
      range === 'all'
        ? Infinity
        : Number(range) * 24 * 60 * 60 * 1000;

    return transactions.filter((tx) => {
      const matchesQuery = `${tx.merchant.name} ${tx.merchant.category} ${tx.bankName}`
        .toLowerCase()
        .includes(query.toLowerCase().trim());
      const matchesBank = bankId === 'all' || tx.bankId === bankId;
      const matchesCategory =
        category === 'all' || tx.merchant.category === category;
      const matchesStatus = status === 'all' || tx.status === status;
      const matchesRange =
        range === 'all' || now - new Date(tx.timestamp).getTime() <= rangeMs;
      return (
        matchesQuery &&
        matchesBank &&
        matchesCategory &&
        matchesStatus &&
        matchesRange
      );
    });
  }, [transactions, query, bankId, category, status, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  if (loading) return <TableSkeleton />;

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <HeaderBox
          title="Transaction History"
          subtext="Search and export Naira activity across every linked Nigerian bank, in WAT."
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => exportTransactionsCsv(filtered)}
            disabled={filtered.length === 0}
          >
            <Download className="mr-2 size-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => printTransactionsPdf(filtered)}
            disabled={filtered.length === 0}
          >
            <ReceiptText className="mr-2 size-4" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="surface-card p-4 md:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <div className="relative xl:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
              placeholder="Search merchant, category, or bank"
              className="h-11 pl-9"
            />
          </div>
          <select
            className="horizon-select"
            value={range}
            onChange={(event) => {
              setRange(event.target.value);
              setPage(1);
            }}
          >
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All dates</option>
          </select>
          <select
            className="horizon-select"
            value={bankId}
            onChange={(event) => {
              setBankId(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">All accounts</option>
            {banks.map((bank) => (
              <option key={bank.id} value={bank.id}>
                {bank.institutionName}
              </option>
            ))}
          </select>
          <select
            className="horizon-select"
            value={category}
            onChange={(event) => {
              setCategory(event.target.value);
              setPage(1);
            }}
          >
            <option value="all">All categories</option>
            {TRANSACTION_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(['all', 'completed', 'pending', 'failed'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
                status === item
                  ? 'bg-forest text-sage dark:bg-sage dark:text-forest'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {item === 'all' ? 'All statuses' : item}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No transactions yet"
          description="No transactions match these filters. Link a Nigerian bank or clear filters to see NIP activity."
          actionLabel="Reset filters"
          onAction={() => {
            setQuery('');
            setRange('all');
            setBankId('all');
            setCategory('all');
            setStatus('all');
            setPage(1);
          }}
        />
      ) : (
        <div className="surface-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-muted/60 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Merchant</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Bank</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-t border-border/80 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex size-9 items-center justify-center rounded-full bg-sage text-forest dark:bg-forest dark:text-sage">
                          <CategoryIcon name={tx.merchant.icon} />
                        </span>
                        <span className="font-medium">{tx.merchant.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <CategoryBadge category={tx.merchant.category} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDateTime(new Date(tx.timestamp)).dateTime}
                    </td>
                    <td className="px-4 py-3">{tx.bankName}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={tx.status as TransactionStatus} />
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-semibold ${
                        tx.amount > 0 ? 'text-success' : 'text-foreground'
                      }`}
                    >
                      {formatSignedAmount(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-3 text-sm">
            <p className="text-muted-foreground">
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of{' '}
              {filtered.length}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setPage((value) => value - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <SecurityBadges />
    </section>
  );
};

export default TransactionHistoryPage;
