'use client';

import { sidebarLinks } from '@/constants';
import { logoutAccount } from '@/lib/actions/user.actions';
import { cn } from '@/lib/utils';
import {
  ArrowLeftRight,
  Download,
  History,
  Landmark,
  LayoutDashboard,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import KycBadge from './KycBadge';
import Logo from './Logo';
import SecurityBadges from './SecurityBadges';
import { useFinance } from '@/lib/finance-context';

const ICONS = {
  '/': LayoutDashboard,
  '/my-banks': Landmark,
  '/transaction-history': History,
  '/payment-transfer': ArrowLeftRight,
  '/receive-money': Download,
  '/settings': Settings,
} as const;

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { kyc } = useFinance();

  const handleLogout = async () => {
    const loggedOut = await logoutAccount();
    if (loggedOut) router.push('/sign-in');
  };

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={40} />
          <h1 className="sidebar-logo">Horizon</h1>
        </Link>

        <div className="flex flex-col gap-1">
          {sidebarLinks.map((item) => {
            const isActive =
              item.route === '/'
                ? pathname === '/'
                : pathname === item.route || pathname.startsWith(`${item.route}/`);
            const Icon = ICONS[item.route as keyof typeof ICONS] ?? LayoutDashboard;
            return (
              <Link
                href={item.route}
                key={item.label}
                className={cn(
                  'sidebar-link text-muted-foreground transition hover:bg-sage/60 hover:text-forest dark:hover:bg-forest/40 dark:hover:text-sage',
                  isActive &&
                    'bg-forest text-sage shadow-sm dark:bg-sage dark:text-forest'
                )}
              >
                <Icon className="size-5" />
                <p
                  className={cn(
                    'sidebar-label',
                    isActive && '!text-sage dark:!text-forest'
                  )}
                >
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="mt-6 flex flex-col gap-4">
        <SecurityBadges className="max-xl:hidden" compact />
        <div className="rounded-2xl border border-border bg-muted/50 p-3">
          <div className="mb-3 hidden items-center gap-3 xl:flex">
            <div className="flex size-10 items-center justify-center rounded-full bg-forest text-sm font-bold text-sage dark:bg-sage dark:text-forest">
              {user?.name?.[0] ?? 'H'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{kyc.preferredName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {kyc.tag} · {user?.email}
              </p>
            </div>
          </div>
          <KycBadge kyc={kyc} compact />
          <button
            type="button"
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-card hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span className="max-xl:hidden">Sign out</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Sidebar;
