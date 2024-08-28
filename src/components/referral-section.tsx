'use client';

import { cn } from '@lib/utils';
import { CopyButton } from '@components/copy-button';
import { Separator } from '@UI/separator';
import { useConnection } from '@hooks/use-connection';
import { useTranslation } from '@i18n/client';

export function ReferralSection() {
  const { address } = useConnection();
  const { t } = useTranslation({ ns: 'settings' });
  if (!address) {
    return null;
  }

  return (
    <div className={cn('flex flex-col gap-2')}>
      <Separator />
      <div className={cn('flex flex-row items-center justify-between')}>
        <span className={cn('text-[14px]')}>{t('referral_title')}</span>
        <CopyButton />
      </div>
    </div>
  );
}
