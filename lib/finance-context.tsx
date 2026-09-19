'use client';

import {
  seedBanks,
  seedRecipients,
  seedTransactions,
  USE_MOCK_DATA,
} from '@/lib/mock-data';
import { defaultKycProfile, generateNuban, nipFee } from '@/lib/nigeria';
import { useToast } from '@/lib/toast';
import { formatAmount } from '@/lib/utils';
import type {
  AccountKind,
  BankAccount,
  ExternalRecipient,
  KycProfile,
  TransactionRecord,
  TransferPayload,
} from '@/types/finance';
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type LinkBankInput = {
  institutionName: string;
  bankCode: string;
  shortName: string;
  accountName: string;
  accountType: AccountKind;
  colorTheme: string;
};

type FinanceContextValue = {
  banks: BankAccount[];
  transactions: TransactionRecord[];
  recipients: ExternalRecipient[];
  kyc: KycProfile;
  totalBalance: number;
  monthlyIncome: number;
  monthlySpending: number;
  dailySent: number;
  linkBank: (input: LinkBankInput) => void;
  unlinkBank: (bankId: string) => void;
  setPrimaryBank: (bankId: string) => void;
  submitTransfer: (payload: TransferPayload) => { id: string; arrival: string };
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

const currentMonth = new Date('2026-09-19T12:00:00Z');

function isSameMonth(iso: string, date: Date) {
  const value = new Date(iso);
  return (
    value.getUTCFullYear() === date.getUTCFullYear() &&
    value.getUTCMonth() === date.getUTCMonth()
  );
}

function isSameDayWAT(iso: string, now = new Date()) {
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Africa/Lagos',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(d);
  return fmt(new Date(iso)) === fmt(now);
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [banks, setBanks] = useState<BankAccount[]>(
    USE_MOCK_DATA ? seedBanks : []
  );
  const [transactions, setTransactions] = useState<TransactionRecord[]>(
    USE_MOCK_DATA ? seedTransactions : []
  );
  const [recipients] = useState<ExternalRecipient[]>(seedRecipients);
  const [kyc] = useState<KycProfile>(defaultKycProfile);

  const totals = useMemo(() => {
    const totalBalance = banks.reduce(
      (sum, bank) => sum + bank.balance.current,
      0
    );
    const monthlyIncome = transactions
      .filter(
        (tx) =>
          tx.type === 'credit' &&
          tx.status !== 'failed' &&
          isSameMonth(tx.timestamp, currentMonth)
      )
      .reduce((sum, tx) => sum + tx.amount, 0);
    const monthlySpending = transactions
      .filter(
        (tx) =>
          tx.type === 'debit' &&
          tx.status !== 'failed' &&
          isSameMonth(tx.timestamp, currentMonth)
      )
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const dailySent = transactions
      .filter(
        (tx) =>
          tx.type === 'debit' &&
          tx.status !== 'failed' &&
          isSameDayWAT(tx.timestamp)
      )
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);

    return { totalBalance, monthlyIncome, monthlySpending, dailySent };
  }, [banks, transactions]);

  const linkBank = useCallback(
    (input: LinkBankInput) => {
      const accountNumber = generateNuban();
      const newBank: BankAccount = {
        id: `ng_bank_${Date.now()}`,
        institutionName: input.institutionName,
        bankCode: input.bankCode,
        shortName: input.shortName,
        accountName: input.accountName,
        accountNumber,
        accountNumberMasked: accountNumber,
        accountType: input.accountType,
        lastFour: accountNumber.slice(-4),
        balance: {
          current: input.accountType === 'savings' ? 25000 : 18500,
          available: input.accountType === 'savings' ? 25000 : 18500,
          currency: 'NGN',
        },
        isPrimary: banks.length === 0,
        colorTheme: input.colorTheme,
        connectionStatus: 'active',
      };

      setBanks((current) => [...current, newBank]);
      toast({
        title: 'Bank linked via Open Banking',
        description: `${input.shortName} ${accountNumber} is connected.`,
      });
    },
    [banks.length, toast]
  );

  const unlinkBank = useCallback(
    (bankId: string) => {
      const bank = banks.find((item) => item.id === bankId);
      setBanks((current) => {
        const remaining = current.filter((item) => item.id !== bankId);
        if (remaining.length && !remaining.some((item) => item.isPrimary)) {
          remaining[0] = { ...remaining[0], isPrimary: true };
        }
        return remaining;
      });
      toast({
        title: 'Bank unlinked',
        description: bank
          ? `${bank.shortName} was removed from Horizon.`
          : 'Account removed.',
        tone: 'info',
      });
    },
    [banks, toast]
  );

  const setPrimaryBank = useCallback(
    (bankId: string) => {
      setBanks((current) =>
        current.map((bank) => ({ ...bank, isPrimary: bank.id === bankId }))
      );
      toast({ title: 'Primary deposit account updated' });
    },
    [toast]
  );

  const submitTransfer = useCallback(
    (payload: TransferPayload) => {
      const source = banks.find((bank) => bank.id === payload.sourceAccountId);
      if (!source) {
        throw new Error('Source account not found');
      }

      const remaining = kyc.dailyLimit - totals.dailySent;
      if (payload.amount > remaining) {
        throw new Error(
          `Tier ${kyc.tier} daily limit is ${formatAmount(kyc.dailyLimit)}. Remaining today: ${formatAmount(Math.max(0, remaining))}.`
        );
      }

      const destinationBank = payload.destination.bankId
        ? banks.find((bank) => bank.id === payload.destination.bankId)
        : undefined;
      const recipientName =
        payload.destination.resolvedAccountName ||
        destinationBank?.accountName ||
        'Recipient';
      const isSelf = payload.destination.type === 'self';
      const fee = payload.fee ?? nipFee(payload.amount, payload.destination.type);
      const arrival = 'Instant · NIP';
      const id = `tx_${Date.now()}`;
      const timestamp = new Date().toISOString();
      const totalDebit = payload.amount + fee;

      setBanks((current) =>
        current.map((bank) => {
          if (bank.id === payload.sourceAccountId) {
            return {
              ...bank,
              balance: {
                ...bank.balance,
                current: bank.balance.current - totalDebit,
                available: bank.balance.available - totalDebit,
              },
            };
          }
          if (destinationBank && bank.id === destinationBank.id) {
            return {
              ...bank,
              balance: {
                ...bank.balance,
                current: bank.balance.current + payload.amount,
                available: bank.balance.available + payload.amount,
              },
            };
          }
          return bank;
        })
      );

      const debit: TransactionRecord = {
        id,
        timestamp,
        merchant: {
          name: isSelf
            ? `Self-transfer to ${destinationBank?.shortName}`
            : `NIP to ${recipientName}`,
          category: 'Transfers',
          icon: 'repeat',
        },
        amount: -payload.amount,
        currency: 'NGN',
        status: 'completed',
        type: 'debit',
        bankId: source.id,
        bankName: source.institutionName,
      };

      const credit: TransactionRecord | null = destinationBank
        ? {
            id: `${id}_in`,
            timestamp,
            merchant: {
              name: `Transfer from ${source.shortName}`,
              category: 'Transfers',
              icon: 'repeat',
            },
            amount: payload.amount,
            currency: 'NGN',
            status: 'completed',
            type: 'credit',
            bankId: destinationBank.id,
            bankName: destinationBank.institutionName,
          }
        : null;

      setTransactions((current) =>
        credit ? [debit, credit, ...current] : [debit, ...current]
      );

      toast({
        title: 'NIP transfer sent',
        description: `${formatAmount(payload.amount)} is on the way. Arrival: ${arrival}.`,
      });

      return { id, arrival };
    },
    [banks, kyc, toast, totals.dailySent]
  );

  const value = useMemo(
    () => ({
      banks,
      transactions,
      recipients,
      kyc,
      ...totals,
      linkBank,
      unlinkBank,
      setPrimaryBank,
      submitTransfer,
    }),
    [
      banks,
      transactions,
      recipients,
      kyc,
      totals,
      linkBank,
      unlinkBank,
      setPrimaryBank,
      submitTransfer,
    ]
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within FinanceProvider');
  }
  return context;
}
