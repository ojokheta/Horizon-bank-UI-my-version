import { cn } from '@/lib/utils';

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-muted',
        className
      )}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />
    </div>
  );
};

export const DashboardSkeleton = () => {
  return (
    <div className="page-shell">
      <div className="space-y-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-80" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <Skeleton className="h-48" />
      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
        <Skeleton className="h-[420px]" />
        <Skeleton className="h-[420px]" />
      </div>
    </div>
  );
};

export const TableSkeleton = () => {
  return (
    <div className="page-shell">
      <Skeleton className="h-9 w-72" />
      <div className="grid gap-3 md:grid-cols-4">
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
        <Skeleton className="h-11" />
      </div>
      <Skeleton className="h-[480px]" />
    </div>
  );
};

export const CardsSkeleton = () => {
  return (
    <div className="page-shell">
      <Skeleton className="h-9 w-56" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
};
