'use client';

import { cn } from '@lib/utils';
import { CopyButton } from '@components/copy-button';
import { Separator } from '@UI/separator';
import { useTranslation } from '@i18n/client';
import { useTonAddress } from '@tonconnect/ui-react';

export function ReferralSection() {
  const walletAddress = useTonAddress();
  const { t } = useTranslation({ ns: 'settings' });

  if (!walletAddress) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-2')}>
      <Separator />
      <div className={cn('flex flex-row items-center justify-between')}>
        <span className={cn('text-[1rem] font-semibold')}>{t('referral_title')}</span>
        <CopyButton />
      </div>
      <div className={cn('flex flex-row items-center justify-between')}>
        <span className={cn('text-[1rem] font-semibold')}>{t('referral_mini_app')}</span>
        <CopyButton miniApp={true} />
      </div>
    </div>
  );
}
