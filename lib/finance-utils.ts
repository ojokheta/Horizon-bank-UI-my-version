import { formatAmount, formatDateTime } from '@/lib/utils';
import type { TransactionRecord } from '@/types/finance';

export const MONTH_LABEL = 'September 2026';

export function formatSignedAmount(amount: number) {
  const formatted = formatAmount(Math.abs(amount));
  if (amount > 0) return `+${formatted}`;
  if (amount < 0) return `-${formatted}`;
  return formatted;
}

export function initials(value: string) {
  const parts = value
    .replace(/[()]/g, '')
    .split(' ')
    .filter((part) => part && !['Bank', 'of', 'the'].includes(part));

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function exportTransactionsCsv(rows: TransactionRecord[]) {
  const header = ['Date (WAT)', 'Merchant', 'Category', 'Bank', 'Status', 'Amount (NGN)'];
  const lines = rows.map((row) =>
    [
      formatDateTime(new Date(row.timestamp)).dateTime,
      `"${row.merchant.name.replaceAll('"', '""')}"`,
      row.merchant.category,
      row.bankName,
      row.status,
      row.amount.toFixed(2),
    ].join(',')
  );

  const blob = new Blob([[header.join(','), ...lines].join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'horizon-nigeria-transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export function printTransactionsPdf(rows: TransactionRecord[]) {
  const html = `
    <html>
      <head>
        <title>Horizon Nigeria Statement</title>
        <style>
          body { font-family: Inter, sans-serif; padding: 32px; color: #111827; }
          h1 { margin-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #e5e7eb; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>Horizon Nigeria statement</h1>
        <p>Generated ${formatDateTime(new Date()).dateTime}</p>
        <table>
          <thead>
            <tr>
              <th>Date (WAT)</th><th>Merchant</th><th>Category</th><th>Bank</th><th>Status</th><th>Amount (NGN)</th>
            </tr>
          </thead>
          <tbody>
            ${rows
              .map(
                (row) => `<tr>
                  <td>${formatDateTime(new Date(row.timestamp)).dateTime}</td>
                  <td>${row.merchant.name}</td>
                  <td>${row.merchant.category}</td>
                  <td>${row.bankName}</td>
                  <td>${row.status}</td>
                  <td>${formatSignedAmount(row.amount)}</td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </body>
    </html>
  `;
  const popup = window.open('', '_blank', 'noopener,noreferrer,width=900,height=700');
  if (!popup) return;
  popup.document.write(html);
  popup.document.close();
  popup.focus();
  popup.print();
}

export async function copyText(value: string) {
  await navigator.clipboard.writeText(value);
}
