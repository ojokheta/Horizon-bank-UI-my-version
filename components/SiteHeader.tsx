'use client';

import HeaderActions from '@/components/HeaderActions';
import Logo from '@/components/Logo';
import Link from 'next/link';

const SiteHeader = () => {
  return (
    <header className="site-header">
      <Link href="/" className="flex items-center gap-2 md:hidden">
        <Logo size={34} />
        <span className="font-ibm-plex-serif text-lg font-bold text-forest dark:text-sage">
          Horizon
        </span>
      </Link>
      <HeaderActions />
    </header>
  );
};

export default SiteHeader;
