import { kycTiers } from '@/lib/nigeria';
import { cn, formatAmount } from '@/lib/utils';
import type { KycProfile } from '@/types/finance';

const KycBadge = ({
  kyc,
  compact = false,
}: {
  kyc: KycProfile;
  compact?: boolean;
}) => {
  const meta = kycTiers[kyc.tier];

  return (
    <div
      className={cn(
        'rounded-xl border border-border bg-card px-2.5 py-2',
        compact && 'px-2 py-1.5'
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-forest px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sage dark:bg-sage dark:text-forest">
          {meta.label}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground">
          {formatAmount(meta.dailyLimit)}/day
        </span>
      </div>
      {!compact ? (
        <p className="mt-1 text-[11px] text-muted-foreground">{meta.description}</p>
      ) : null}
    </div>
  );
};

export default KycBadge;
