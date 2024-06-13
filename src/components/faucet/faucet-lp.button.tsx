'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { faucetLp } from './faucet';
import { firstValueFrom } from 'rxjs';
import { successTransaction } from '@utils/transaction-subjects';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';
import { TransactionCompleted } from '@components/transactions/completed';
import { useTranslation } from '@i18n/client';

export function FaucetLpButton({ disabled }: { disabled: boolean }) {
  const { vault } = useParams(VaultPage);
  const { sender } = useConnection({ batch: true });
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    await faucetLp(sender, Address.parse(vault));

    const hash = await firstValueFrom(successTransaction);

    toast.success(<TransactionCompleted hash={hash} />);
  };

  return (
    <Button disabled={disabled} onClick={handleFaucet} className='custom-secondary-btn'>
      {t('faucet.button')}
    </Button>
  );
}
