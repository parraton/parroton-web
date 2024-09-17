'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { faucetToken } from './faucet';
import { firstValueFrom } from 'rxjs';
import { successTransaction } from '@utils/transaction-subjects';
import { toast } from 'sonner';
import { TransactionCompleted } from '@components/transactions/completed';
import { useTranslation } from '@i18n/client';

export function FaucetTokenButton({
  disabled,
  assetAddress,
}: {
  disabled: boolean;
  assetAddress: string;
}) {
  const { sender } = useConnection();
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    await faucetToken(sender, assetAddress);

    const hash = await firstValueFrom(successTransaction);

    toast.success(<TransactionCompleted hash={hash} />);
  };

  return (
    <Button disabled={disabled} onClick={handleFaucet} className='custom-main-btn'>
      {t('mint.button')}
    </Button>
  );
}
