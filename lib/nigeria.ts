import type {
  AccountKind,
  ExternalRecipient,
  InstitutionOption,
  KycProfile,
  KycTier,
} from '@/types/finance';

export const WAT_TIME_ZONE = 'Africa/Lagos';

export const nigerianBanks: InstitutionOption[] = [
  {
    id: 'gtb',
    name: 'Guaranty Trust Bank (GTBank)',
    shortName: 'GTBank',
    bankCode: '058',
    colorTheme: '#DD4B39',
    category: 'commercial',
  },
  {
    id: 'access',
    name: 'Access Bank',
    shortName: 'Access',
    bankCode: '044',
    colorTheme: '#0033A1',
    category: 'commercial',
  },
  {
    id: 'zenith',
    name: 'Zenith Bank',
    shortName: 'Zenith',
    bankCode: '057',
    colorTheme: '#ED1C24',
    category: 'commercial',
  },
  {
    id: 'uba',
    name: 'United Bank for Africa (UBA)',
    shortName: 'UBA',
    bankCode: '033',
    colorTheme: '#D21A1A',
    category: 'commercial',
  },
  {
    id: 'firstbank',
    name: 'First Bank of Nigeria',
    shortName: 'FirstBank',
    bankCode: '011',
    colorTheme: '#003087',
    category: 'commercial',
  },
  {
    id: 'kuda',
    name: 'Kuda Microfinance Bank',
    shortName: 'Kuda',
    bankCode: '50211',
    colorTheme: '#40196C',
    category: 'mfb',
  },
  {
    id: 'opay',
    name: 'OPay Digital Services',
    shortName: 'OPay',
    bankCode: '100004',
    colorTheme: '#1DCF9F',
    category: 'wallet',
  },
  {
    id: 'palmpay',
    name: 'PalmPay',
    shortName: 'PalmPay',
    bankCode: '100033',
    colorTheme: '#6B21A8',
    category: 'wallet',
  },
  {
    id: 'moniepoint',
    name: 'Moniepoint MFB',
    shortName: 'Moniepoint',
    bankCode: '090405',
    colorTheme: '#0F766E',
    category: 'mfb',
  },
];

export const kycTiers: Record<
  KycTier,
  { label: string; description: string; dailyLimit: number }
> = {
  1: { label: 'Tier 1', description: 'BVN linked', dailyLimit: 50000 },
  2: {
    label: 'Tier 2',
    description: 'NIN + address verified',
    dailyLimit: 200000,
  },
  3: {
    label: 'Tier 3',
    description: 'Government ID verified',
    dailyLimit: 5000000,
  },
};

export const defaultKycProfile: KycProfile = {
  legalName: 'CHUKWUEMEKA OLUMIDE ADEBAYO',
  preferredName: 'Olumide Adebayo',
  tier: 2,
  dailyLimit: 200000,
  bvnMasked: '22******91',
  ninMasked: '12******08',
  tag: '@olumide',
  phone: '08034412291',
  virtualNuban: '9901234567',
  virtualBankName: 'Horizon MFB',
  virtualBankCode: '090110',
};

const NAME_POOL = [
  'ADAMU BELLO SANI',
  'IFEOMA NKECHI OKAFOR',
  'FATIMA YUSUF BELLO',
  'IBRAHIM MUSA ABDULLAHI',
  'CHIDINMA GRACE EZE',
  'OMOWUNMI KAFAYAT LAWAL',
  'TEMITOPE AYOMIDE BALOGUN',
  'NNAMDI KENECHUKWU OKORO',
];

export const knownNubanDirectory: Record<string, string> = {
  '033:2098765432': 'ADAMU BELLO SANI',
  '057:4011223344': 'IFEOMA NKECHI OKAFOR',
  '044:0698765432': 'IBRAHIM MUSA ABDULLAHI',
  '011:3099887766': 'CHIDINMA GRACE EZE',
};

export const knownTags: Record<
  string,
  { name: string; bankCode: string; accountNumber: string; bankName: string }
> = {
  '@adamu': {
    name: 'ADAMU BELLO SANI',
    bankCode: '033',
    accountNumber: '2098765432',
    bankName: 'United Bank for Africa (UBA)',
  },
  '08034412290': {
    name: 'FATIMA YUSUF BELLO',
    bankCode: '50211',
    accountNumber: '2019988776',
    bankName: 'Kuda Microfinance Bank',
  },
};

export function findBank(code: string) {
  return nigerianBanks.find((bank) => bank.bankCode === code);
}

export function resolveNubanName(bankCode: string, accountNumber: string) {
  if (!/^\d{10}$/.test(accountNumber)) return null;
  const known = knownNubanDirectory[`${bankCode}:${accountNumber}`];
  if (known) return known;
  const index = Number(accountNumber.slice(-2)) % NAME_POOL.length;
  return NAME_POOL[index];
}

export function resolveTagOrPhone(value: string) {
  const key = value.trim().toLowerCase();
  return (
    knownTags[key] ||
    knownTags[key.replace(/\s+/g, '')] ||
    null
  );
}

export function nipFee(amount: number, channel: 'self' | 'nuban' | 'tag') {
  if (channel === 'self' || channel === 'tag') return 0;
  if (amount <= 5000) return 10.75;
  if (amount <= 50000) return 26.88;
  return 53.75;
}

export function generateNuban() {
  return String(Math.floor(1000000000 + Math.random() * 8999999999));
}

export const defaultAccountTypes: { value: AccountKind; label: string }[] = [
  { value: 'savings', label: 'Savings' },
  { value: 'current', label: 'Current' },
  { value: 'spend_save', label: 'Spend & Save' },
  { value: 'wallet', label: 'Wallet' },
];

export const seedExternalRecipients: ExternalRecipient[] = [
  {
    id: 'rcp_01',
    name: 'ADAMU BELLO SANI',
    emailOrPhone: '08035551234',
    accountNumber: '2098765432',
    bankCode: '033',
    bankName: 'United Bank for Africa (UBA)',
    tag: '@adamu',
  },
  {
    id: 'rcp_02',
    name: 'IFEOMA NKECHI OKAFOR',
    emailOrPhone: 'ifeoma.okafor@gmail.com',
    accountNumber: '4011223344',
    bankCode: '057',
    bankName: 'Zenith Bank',
  },
];

export function accountTypeLabel(type: AccountKind) {
  return (
    defaultAccountTypes.find((item) => item.value === type)?.label || type
  );
}
