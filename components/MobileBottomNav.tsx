'use client';

import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  CircleUser,
  CreditCard,
  House,
  Plus,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { LucideIcon } from 'lucide-react';

const ITEMS: {
  href: string;
  label: string;
  icon: LucideIcon;
  plus?: boolean;
}[] = [
  { href: '/', label: 'Home', icon: House },
  { href: '/my-banks', label: 'Cards', icon: CreditCard },
  { href: '/receive-money', label: 'Add Funds', icon: Wallet, plus: true },
  { href: '/transaction-history', label: 'Transaction', icon: ArrowLeftRight },
  { href: '/settings', label: 'Profile', icon: CircleUser },
];

const isItemActive = (pathname: string, href: string) => {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
};

const TabIcon = ({
  icon: Icon,
  plus,
  className,
  filled = false,
}: {
  icon: LucideIcon;
  plus?: boolean;
  className?: string;
  filled?: boolean;
}) => (
  <span className={cn('relative inline-flex', className)}>
    <Icon className="size-6" fill={filled ? 'currentColor' : 'none'} strokeWidth={filled ? 0 : 1.75} />
    {plus ? (
      <Plus
        className="absolute -right-1.5 -top-1.5 size-3.5"
        strokeWidth={3}
      />
    ) : null}
  </span>
);

const MobileBottomNav = () => {
  const pathname = usePathname();
  const activeIndex = ITEMS.findIndex((item) => isItemActive(pathname, item.href));
  const activeItem = activeIndex >= 0 ? ITEMS[activeIndex] : null;

  return (
    <nav
      aria-label="Mobile navigation"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 md:hidden"
    >
      <div className="pointer-events-auto relative mx-3 mb-[max(0.65rem,env(safe-area-inset-bottom))] h-[4.5rem] overflow-visible rounded-[2rem] border border-border bg-card px-1 pb-2 pt-3 shadow-[0_12px_40px_-16px_rgba(16,24,40,0.35)]">
        {activeItem ? (
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-1/5 transition-transform duration-500 ease-spring-out will-change-transform"
            style={{ transform: `translateX(${activeIndex * 100}%)` }}
          >
            <span className="absolute left-1/2 top-0 size-[3.55rem] -translate-x-1/2 -translate-y-[1.85rem] rounded-full bg-card" />
            <span className="absolute left-1/2 top-0 size-12 -translate-x-1/2 -translate-y-[1.4rem]">
              <span
                key={activeItem.href}
                className="flex size-12 items-center justify-center rounded-full bg-forest text-sage shadow-lift animate-tab-pop dark:bg-sage dark:text-forest"
              >
                <TabIcon icon={activeItem.icon} plus={activeItem.plus} filled />
              </span>
            </span>
            <span className="absolute bottom-0 left-1/2 h-[3px] w-7 -translate-x-1/2 rounded-full bg-foreground/80" />
          </div>
        ) : null}

        <div className="relative z-10 flex h-full items-end">
          {ITEMS.map((item, index) => {
            const active = index === activeIndex;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className="relative flex min-h-11 min-w-0 flex-1 flex-col items-center justify-end pb-0.5"
              >
                <span
                  className={cn(
                    'text-muted-foreground transition-opacity duration-200',
                    active && 'opacity-0'
                  )}
                >
                  <span className="relative inline-flex">
                    <Icon className="size-5" strokeWidth={1.75} />
                    {item.plus ? (
                      <Plus
                        className="absolute -right-1.5 -top-1 size-3"
                        strokeWidth={2.5}
                      />
                    ) : null}
                  </span>
                </span>
                <span
                  className={cn(
                    'mt-1 truncate px-0.5 text-[10px] font-medium text-muted-foreground transition-all duration-300',
                    active && 'text-[11px] font-semibold text-foreground'
                  )}
                >
                  {item.label}
                </span>
                <span className="mt-1 h-[3px] w-7" />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
