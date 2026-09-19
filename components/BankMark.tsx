import { initials } from '@/lib/finance-utils';
import { cn } from '@/lib/utils';

const BankMark = ({
  name,
  color,
  code,
  size = 'md',
}: {
  name: string;
  color: string;
  code?: string;
  size?: 'sm' | 'md';
}) => {
  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          'flex items-center justify-center rounded-lg text-[11px] font-bold text-white',
          size === 'sm' ? 'size-8' : 'size-10 text-sm'
        )}
        style={{ backgroundColor: color }}
      >
        {initials(name).slice(0, 2) || name.slice(0, 2).toUpperCase()}
      </span>
      {code ? (
        <span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {code}
        </span>
      ) : null}
    </div>
  );
};

export default BankMark;
