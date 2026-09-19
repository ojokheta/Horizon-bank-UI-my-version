import { cn } from '@/lib/utils';
import type { TransactionStatus } from '@/types/finance';
import {
  ArrowDownLeft,
  ArrowLeftRight,
  Car,
  Coins,
  FileText,
  Monitor,
  Repeat,
  ShoppingBag,
  Smartphone,
  Utensils,
  Zap,
} from 'lucide-react';

export const CategoryIcon = ({ name }: { name: string }) => {
  const map: Record<string, typeof Monitor> = {
    monitor: Monitor,
    'arrow-down-left': ArrowDownLeft,
    'shopping-bag': ShoppingBag,
    repeat: Repeat,
    car: Car,
    'file-text': FileText,
    smartphone: Smartphone,
    zap: Zap,
    utensils: Utensils,
    coins: Coins,
    plane: Repeat,
    transfer: ArrowLeftRight,
  };
  const Icon = map[name] ?? ShoppingBag;
  return <Icon className="size-4" />;
};

export const StatusBadge = ({ status }: { status: TransactionStatus }) => {
  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold capitalize',
        status === 'completed' &&
          'bg-sage text-forest dark:bg-forest/50 dark:text-sage',
        status === 'pending' && 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200',
        status === 'failed' && 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200'
      )}
    >
      {status}
    </span>
  );
};

export const CategoryBadge = ({ category }: { category: string }) => {
  return (
    <span className="inline-flex rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
      {category}
    </span>
  );
};
