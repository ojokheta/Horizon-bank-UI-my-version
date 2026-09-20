'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserCircle } from 'reicon-react';

const HeaderActions = ({
  showProfile = true,
}: {
  showProfile?: boolean;
}) => {
  const pathname = usePathname();
  const onProfile = pathname === '/settings';

  return (
    <div className="flex items-center gap-2">
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
          <UserCircle className="size-5" />
        </Link>
      ) : null}
    </div>
  );
};

export default HeaderActions;
