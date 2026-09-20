'use client';

import HeaderBox from '@/components/HeaderBox';
import KycBadge from '@/components/KycBadge';
import SecurityBadges from '@/components/SecurityBadges';
import { TableSkeleton } from '@/components/Skeletons';
import { Button } from '@/components/ui/button';
import { logoutAccount } from '@/lib/actions/user.actions';
import { useFinance } from '@/lib/finance-context';
import { kycTiers } from '@/lib/nigeria';
import { useSimulatedLoading } from '@/lib/use-simulated-loading';
import { formatAmount } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Bank, Logout } from 'reicon-react';

const SettingsPage = ({ user }: { user: User }) => {
  const loading = useSimulatedLoading();
  const router = useRouter();
  const { kyc, banks } = useFinance();
  const tier = kycTiers[kyc.tier];

  const handleLogout = async () => {
    const loggedOut = await logoutAccount();
    if (loggedOut) router.push('/sign-in');
  };

  if (loading) return <TableSkeleton />;

  const rows = [
    { label: 'Legal name', value: kyc.legalName },
    { label: 'Preferred name', value: kyc.preferredName },
    { label: 'Horizon tag', value: kyc.tag },
    { label: 'Email', value: user.email },
    { label: 'Phone', value: kyc.phone },
  ];

  const kycRows = [
    { label: 'BVN', value: kyc.bvnMasked },
    { label: 'NIN', value: kyc.ninMasked },
    { label: 'Daily NIP limit', value: `${formatAmount(tier.dailyLimit)}/day` },
    {
      label: 'Linked banks',
      value: `${banks.length} account${banks.length === 1 ? '' : 's'}`,
    },
  ];

  return (
    <section className="page-shell">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <HeaderBox
          title="Settings"
          subtext="Profile, KYC, and security for your Horizon account."
        />
        <SecurityBadges />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <article className="surface-card p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-forest text-2xl font-bold text-sage dark:bg-sage dark:text-forest">
              {kyc.preferredName[0]}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{kyc.preferredName}</h2>
              <p className="text-sm text-muted-foreground">{kyc.tag}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <dl className="mt-6 divide-y divide-border">
            {rows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 py-3 text-sm"
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="text-right font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="surface-card p-6">
          <h2 className="text-lg font-semibold">Verification</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your current KYC tier and identity documents on file.
          </p>
          <div className="mt-4">
            <KycBadge kyc={kyc} />
          </div>
          <dl className="mt-4 divide-y divide-border">
            {kycRows.map((row) => (
              <div
                key={row.label}
                className="flex items-start justify-between gap-4 py-3 text-sm"
              >
                <dt className="text-muted-foreground">{row.label}</dt>
                <dd className="text-right font-medium">{row.value}</dd>
              </div>
            ))}
          </dl>
          <Link
            href="/my-banks"
            className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-forest dark:text-sage"
          >
            <Bank className="size-4" />
            Manage linked banks
          </Link>
        </article>

        <article className="surface-card p-6">
          <h2 className="text-lg font-semibold">Session</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign out of Horizon on this device. Linked banks stay connected for
            the next sign-in.
          </p>
          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="mt-5 gap-2"
          >
            <Logout className="size-4" />
            Sign out
          </Button>
        </article>
      </div>
    </section>
  );
};

export default SettingsPage;
