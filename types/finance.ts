export type CurrencyCode = 'NGN';

export type AccountKind = 'savings' | 'current' | 'spend_save' | 'wallet';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export type TransactionType = 'debit' | 'credit';

export type TransferFrequency = 'one_time' | 'weekly' | 'monthly';

export type DestinationType = 'self' | 'nuban' | 'tag';

export type ConnectionStatus = 'active' | 'expired' | 'revoked';

export type KycTier = 1 | 2 | 3;

export type BankAccount = {
  id: string;
  institutionName: string;
  bankCode: string;
  accountName: string;
  accountNumber: string;
  accountNumberMasked: string;
  accountType: AccountKind;
  lastFour: string;
  balance: {
    current: number;
    available: number;
    currency: CurrencyCode;
  };
  isPrimary: boolean;
  colorTheme: string;
  connectionStatus: ConnectionStatus;
  shortName: string;
};

export type Merchant = {
  name: string;
  category: string;
  icon: string;
};

export type TransactionRecord = {
  id: string;
  timestamp: string;
  merchant: Merchant;
  amount: number;
  currency: CurrencyCode;
  status: TransactionStatus;
  type: TransactionType;
  bankId: string;
  bankName: string;
};

export type ExternalRecipient = {
  id: string;
  name: string;
  emailOrPhone: string;
  accountNumber: string;
  bankCode: string;
  bankName: string;
  tag?: string;
};

export type TransferPayload = {
  sourceAccountId: string;
  destination: {
    type: DestinationType;
    bankCode?: string;
    bankName?: string;
    accountNumber?: string;
    resolvedAccountName?: string;
    bankId?: string;
    tagOrPhone?: string;
  };
  amount: number;
  currency: CurrencyCode;
  narration: string;
  fee: number;
};

export type InstitutionOption = {
  id: string;
  name: string;
  shortName: string;
  bankCode: string;
  colorTheme: string;
  category: 'commercial' | 'mfb' | 'wallet';
};

export type KycProfile = {
  legalName: string;
  preferredName: string;
  tier: KycTier;
  dailyLimit: number;
  bvnMasked: string;
  ninMasked: string;
  tag: string;
  phone: string;
  virtualNuban: string;
  virtualBankName: string;
  virtualBankCode: string;
};
