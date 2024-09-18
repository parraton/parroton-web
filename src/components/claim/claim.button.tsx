'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';
import { claim } from '@components/claim/claim';
import { useTranslation } from '@i18n/client';

export function ClaimButton() {
  const { t } = useTranslation({ ns: 'common' });

  const { vault } = useParams(VaultPage);
  const { sender } = useConnection();

  const handleClaim = async () => {
    try {
      await claim(sender, Address.parse(vault));
      // TODO: implement status tracking
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <Button onClick={handleClaim} className='custom-main-btn'>
      {t('rewards')}
    </Button>
  );
}
