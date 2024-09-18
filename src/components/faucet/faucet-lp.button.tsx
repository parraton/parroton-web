'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { faucetLp } from './faucet';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';
import { useTranslation } from '@i18n/client';

export function FaucetLpButton({ disabled }: { disabled: boolean }) {
  const { vault } = useParams(VaultPage);
  const { sender } = useConnection({ batch: true });
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    try {
      await faucetLp(sender, Address.parse(vault));
      // TODO: implement status tracking
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <Button disabled={disabled} onClick={handleFaucet} className='custom-secondary-btn'>
      {t('faucet.button')}
    </Button>
  );
}
