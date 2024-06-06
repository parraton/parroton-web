'use client';

import { Button } from '@UI/button';
import { useConnection } from '@hooks/use-connection';
import { faucet } from './faucet';
import { firstValueFrom } from 'rxjs';
import { successTransaction } from '@utils/transaction-subjects';
import { toast } from 'sonner';
import { TonviewerLink } from '@components/tonviewer-link';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { Address } from '@ton/core';

export function FaucetButton() {
  const { vault } = useParams(VaultPage);
  const { sender } = useConnection({ batch: true });

  const handleFaucet = async () => {
    await faucet(sender, Address.parse(vault));

    const hash = await firstValueFrom(successTransaction);

    toast.success(
      <div>
        <div>Transaction sent</div>
        <TonviewerLink hash={hash} />
      </div>,
    );
  };

  return <Button onClick={handleFaucet}>Faucet</Button>;
}
