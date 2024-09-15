import { deposit as depositApi, getVault, getWallet } from '@core';
import { Address, toNano } from '@ton/core';
import { useConnection } from '@hooks/use-connection';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { usePool } from '@hooks/use-pool';

export const useDeposit = () => {
  const { sender } = useConnection();
  const { vault: vaultAddress } = useParams(VaultPage);

  const { pool } = usePool(vaultAddress);

  const deposit = async (amount: string | number) => {
    if (!sender?.address || !pool) {
      return;
    }

    const vault = await getVault(Address.parse(vaultAddress));
    const investorLpWallet = await getWallet(sender.address, pool);

    const atomicAmount = toNano(amount);

    const referral = localStorage.getItem('ref');

    return await depositApi(investorLpWallet, vault, sender, atomicAmount, referral);
  };

  return { deposit };
};
