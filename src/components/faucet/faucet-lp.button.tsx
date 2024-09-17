'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { faucetLp } from './faucet';
import { firstValueFrom } from 'rxjs';
import { successTransaction } from '@utils/transaction-subjects';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { TransactionCompleted } from '@components/transactions/completed';
import { useTranslation } from '@i18n/client';
import { useVaultData } from '@hooks/use-vault-data';

export function FaucetLpButton({ disabled }: { disabled: boolean }) {
  const { vault: vaultAddress } = useParams(VaultPage);
  const { vault } = useVaultData(vaultAddress);
  const { sender } = useConnection({ batch: true });
  const { t } = useTranslation({ ns: 'form' });

  const handleFaucet = async () => {
    if (!vault) {
      return;
    }

    try {
      await faucetLp(sender, vault);

      const hash = await firstValueFrom(successTransaction);

      toast.success(<TransactionCompleted hash={hash} />);
    } catch (error) {
      console.error(error);
      toast.error('Failed to get LP');
    }
  };

  return (
    <Button disabled={disabled} onClick={handleFaucet} className='custom-secondary-btn'>
      {t('faucet.button')}
    </Button>
  );
}
