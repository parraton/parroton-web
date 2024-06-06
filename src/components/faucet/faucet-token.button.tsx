'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { faucetToken } from './faucet';
import { firstValueFrom } from 'rxjs';
import { successTransaction } from '@utils/transaction-subjects';
import { toast } from 'sonner';
import { TonviewerLink } from '@components/tonviewer-link';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';

const transactionSent = 'Transaction sent';
const FaucetToken = 'Faucet';

export function FaucetTokenButton() {
  const { vault } = useParams(VaultPage);
  const { sender } = useConnection();

  const handleFaucet = async () => {
    await faucetToken(sender, Address.parse(vault));

    const hash = await firstValueFrom(successTransaction);

    toast.success(
      <div>
        <div>{transactionSent}</div>
        <TonviewerLink hash={hash} />
      </div>,
    );
  };

  return <Button onClick={handleFaucet}>{FaucetToken}</Button>;
}
