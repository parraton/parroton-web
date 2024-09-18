'use client';

import { Button } from '@UI/button';
import { FAUCET_JETTON_AMOUNT } from './faucet';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';
import { useTranslation } from '@i18n/client';
import { useTonAddress } from '@tonconnect/ui-react';
import { useSendTransaction } from '@hooks/use-send-transaction.hook';
import { getStrategyInfoByVault } from '@core/helpers';
import { mint } from '@core/functions/mint';

export function FaucetTokenButton({ disabled }: { disabled: boolean }) {
  const { vault } = useParams(VaultPage);
  const walletAddress = useTonAddress();
  const sendTransaction = useSendTransaction();
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    try {
      if (!walletAddress) {
        return;
      }
      const { jettonMasterAddress } = await getStrategyInfoByVault(Address.parse(vault));
      const address = Address.parse(walletAddress);
      const mintMessage = mint(jettonMasterAddress, address, FAUCET_JETTON_AMOUNT);

      await sendTransaction(address, [mintMessage]);
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again later.');
    }
  };

  return (
    <Button disabled={disabled} onClick={handleFaucet} className='custom-main-btn'>
      {t('mint.button')}
    </Button>
  );
}
