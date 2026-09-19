'use client';

import { FinanceProvider } from '@/lib/finance-context';
import type { ReactNode } from 'react';
import MobileBottomNav from './MobileBottomNav';
import Sidebar from './Sidebar';
import SiteHeader from './SiteHeader';

const AppShell = ({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) => {
  return (
    <FinanceProvider>
      <main className="flex h-[100dvh] w-full bg-background font-inter">
        <Sidebar user={user} />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <SiteHeader />
          <div className="flex-1 overflow-y-auto overscroll-y-contain bg-background pb-[calc(6.25rem+env(safe-area-inset-bottom))] md:pb-0">
            {children}
          </div>
          <MobileBottomNav />
        </div>
      </main>
    </FinanceProvider>
  );
};

export default AppShell;
