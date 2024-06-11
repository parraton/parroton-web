'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { firstValueFrom } from 'rxjs';
import { successTransaction } from '@utils/transaction-subjects';
import { toast } from 'sonner';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';
import { claim } from '@components/claim/claim';
import { useTranslation } from '@i18n/client';
import { TransactionCompleted } from '@components/transactions/completed';

export function ClaimButton() {
  const { t } = useTranslation({ ns: 'common' });

  const { vault } = useParams(VaultPage);
  const { sender } = useConnection();

  const handleClaim = async () => {
    await claim(sender, Address.parse(vault));

    const hash = await firstValueFrom(successTransaction);

    toast.success(<TransactionCompleted hash={hash} />);
  };

  return (
    <Button onClick={handleClaim} className='custom-main-btn'>
      {t('rewards')}
    </Button>
  );
}
