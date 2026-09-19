'use client';

import ThemeToggle from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { CircleUser } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const HeaderActions = ({
  showProfile = true,
}: {
  showProfile?: boolean;
}) => {
  const pathname = usePathname();
  const onProfile = pathname === '/settings';

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      {showProfile ? (
        <Link
          href="/settings"
          aria-label="Open profile and settings"
          className={cn(
            'flex size-10 items-center justify-center rounded-full border border-border bg-muted/70 text-foreground transition hover:bg-muted active:scale-95',
            onProfile &&
              'border-forest bg-forest text-sage dark:border-sage dark:bg-sage dark:text-forest'
          )}
        >
          <CircleUser className="size-5" />
        </Link>
      ) : null}
    </div>
  );
};

export default HeaderActions;
