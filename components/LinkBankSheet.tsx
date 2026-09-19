'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useFinance } from '@/lib/finance-context';
import { seedInstitutions } from '@/lib/mock-data';
import { defaultAccountTypes } from '@/lib/nigeria';
import type { AccountKind } from '@/types/finance';
import { useState, type FormEvent } from 'react';
import SecurityBadges from './SecurityBadges';

const LinkBankSheet = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const { linkBank, kyc } = useFinance();
  const [institutionId, setInstitutionId] = useState(seedInstitutions[0].id);
  const [accountType, setAccountType] = useState<AccountKind>('savings');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const institution = seedInstitutions.find((item) => item.id === institutionId);
    if (!institution) return;

    linkBank({
      institutionName: institution.name,
      bankCode: institution.bankCode,
      shortName: institution.shortName,
      accountName: kyc.legalName,
      accountType,
      colorTheme: institution.colorTheme,
    });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="bg-card sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Connect a Nigerian bank</SheetTitle>
          <SheetDescription>
            This demo mimics a Mono / Okra / Stitch Open Banking widget. Consent
            is stored locally only.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          <div className="space-y-2">
            <Label htmlFor="institution">Institution</Label>
            <select
              id="institution"
              className="horizon-select w-full"
              value={institutionId}
              onChange={(event) => setInstitutionId(event.target.value)}
            >
              {seedInstitutions.map((institution) => (
                <option key={institution.id} value={institution.id}>
                  {institution.shortName} · {institution.bankCode}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountType">Account type</Label>
            <select
              id="accountType"
              className="horizon-select w-full"
              value={accountType}
              onChange={(event) =>
                setAccountType(event.target.value as AccountKind)
              }
            >
              {defaultAccountTypes.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-muted-foreground">
            Account name will resolve as {kyc.legalName} after NIBSS name
            enquiry.
          </p>

          <SecurityBadges />

          <Button type="submit" className="mt-2">
            Continue with Open Banking
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default LinkBankSheet;
