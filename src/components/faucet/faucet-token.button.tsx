'use client';

import { Button } from '@UI/button';
import { toast } from 'sonner';
import { Address, toNano } from '@ton/core';
import { useTranslation } from '@i18n/client';
import { useTonAddress } from '@tonconnect/ui-react';
import { useSendTransaction } from '@hooks/use-send-transaction.hook';
import { mint } from '@core/functions/mint';

const FAUCET_JETTON_AMOUNT = toNano('10');

export function FaucetTokenButton({
  disabled,
  assetAddress,
}: {
  disabled: boolean;
  assetAddress: string;
}) {
  const walletAddress = useTonAddress();
  const sendTransaction = useSendTransaction();
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    try {
      if (!walletAddress) {
        return;
      }

      const address = Address.parse(walletAddress);
      const mintMessage = mint(Address.parse(assetAddress), address, FAUCET_JETTON_AMOUNT);

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
