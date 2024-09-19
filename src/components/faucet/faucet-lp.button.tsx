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
import { useVaultData } from '@hooks/use-vault-data';

export function FaucetLpButton({ disabled }: { disabled: boolean }) {
  const { vault: vaultAddress } = useParams(VaultPage);
  const { vault } = useVaultData(vaultAddress);
  const walletAddress = useTonAddress();
  const sendTransaction = useSendTransaction();
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    try {
      if (!walletAddress || !vault) {
        return;
      }
      const faucetMessages = await faucetLp(Address.parse(walletAddress), vault);
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
