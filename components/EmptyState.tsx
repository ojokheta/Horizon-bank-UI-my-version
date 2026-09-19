import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Landmark } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
  className?: string;
};

const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Landmark,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-14 text-center',
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-sage text-forest dark:bg-forest dark:text-sage">
        <Icon className="size-6" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};

export default EmptyState;
