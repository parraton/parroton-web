'use client';

import { Button } from '@UI/button';
import { faucetLp } from './faucet';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';
import { useTranslation } from '@i18n/client';
import { useSendTransaction } from '@hooks/use-send-transaction.hook';
import { useTonAddress } from '@tonconnect/ui-react';

export function FaucetLpButton({ disabled }: { disabled: boolean }) {
  const { vault } = useParams(VaultPage);
  const walletAddress = useTonAddress();
  const sendTransaction = useSendTransaction();
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    try {
      if (!walletAddress) {
        return;
      }
      const faucetMessages = await faucetLp(Address.parse(walletAddress), Address.parse(vault));
      await sendTransaction(Address.parse(walletAddress), faucetMessages);
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
