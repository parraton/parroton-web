'use client';

import { Button } from '@UI/button';
import { useTranslation } from '@i18n/client';
import { useCallback } from 'react';

export function ClaimButton() {
  const { t } = useTranslation({ ns: 'common' });

  const handleClaim = useCallback(async () => {
    console.log('TODO: implement claim');
  }, []);

  return (
    <Button onClick={handleClaim} className='custom-main-btn'>
      {t('rewards')}
    </Button>
  );
}
