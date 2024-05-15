'use client';

import { Button } from '@UI/button';
import { useTranslation } from '@i18n/client';
import { SonnerDemo } from '@components/sonner-demo';
import { TonConnectButton } from '@tonconnect/ui-react';

export function Demo() {
  const { t } = useTranslation({ ns: 'demo' });
  return (
    <div className='flex flex-col gap-2'>
      <Button onClick={() => alert('click')}>{t('button_text')}</Button>
      <SonnerDemo />
      <TonConnectButton />
    </div>
  );
}
