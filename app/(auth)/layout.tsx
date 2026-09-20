import Image from 'next/image';
import type { ReactNode } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <main className="flex min-h-[100dvh] w-full justify-between bg-background font-inter">
      <div className="relative flex w-full justify-center">{children}</div>
      <div className="auth-asset">
        <div className="auth-preview">
          <Image
            src="/images/auth-dashboard.png"
            alt="Horizon Nigeria dashboard"
            width={1600}
            height={980}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>
    </main>
  );
}
