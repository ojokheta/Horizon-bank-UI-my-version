import { cn } from '@/lib/utils';
import Link from 'next/link';
import type { ReactNode } from 'react';

const HeaderBox = ({ type, title, user, subtext }: HeaderBoxProps) => {
  return (
    <div className="header-box">
      <h1 className="header-box-title">
        {title}
        {type === 'greeting' && (
          <span className="text-forest dark:text-sage">&nbsp;{user}</span>
        )}
      </h1>
      <p className="header-box-subtext">{subtext}</p>
    </div>
  );
};

export const MetricCard = ({
  label,
  value,
  hint,
  trend,
  href,
}: {
  label: string;
  value: ReactNode;
  hint?: string;
  trend?: 'up' | 'down' | 'neutral';
  href?: string;
}) => {
  const content = (
    <>
      <div className="pointer-events-none absolute -right-6 -top-8 size-24 rounded-full bg-sage/70 dark:bg-sage/10" />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <div className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
        {value}
      </div>
      {hint ? (
        <p
          className={cn(
            'mt-2 text-xs font-medium',
            trend === 'up' && 'text-success',
            trend === 'down' && 'text-destructive',
            trend === 'neutral' && 'text-muted-foreground'
          )}
        >
          {hint}
        </p>
      ) : null}
    </>
  );

  const className =
    'surface-card relative overflow-hidden p-5 text-left transition hover:border-forest/30';

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <article className={className}>{content}</article>;
};

export default HeaderBox;
