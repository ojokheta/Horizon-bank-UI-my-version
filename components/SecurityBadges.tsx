import { cn } from '@/lib/utils';
import { Bank, Building2, ShieldCheck } from 'reicon-react';

const BADGES = [
  { icon: ShieldCheck, label: 'NDIC Insured' },
  { icon: Bank, label: 'In partnership with CBN-licensed banks' },
  { icon: Building2, label: 'NIP secured by NIBSS' },
] as const;

const SecurityBadges = ({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) => {
  const items = compact ? BADGES.slice(0, 2) : BADGES;

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      {items.map(({ icon: Icon, label }) => (
        <span
          key={label}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border border-border bg-sage/60 px-2.5 py-1 text-[11px] font-medium text-forest dark:bg-forest/40 dark:text-sage',
            compact && 'px-2 py-0.5'
          )}
        >
          <Icon className="size-3.5" />
          {label}
        </span>
      ))}
    </div>
  );
};

export default SecurityBadges;
