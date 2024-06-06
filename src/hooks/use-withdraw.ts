import { getSharesWallet, getVault, withdraw as withdrawApi } from '@core';
import { Address, toNano } from '@ton/core';
import { useConnection } from '@hooks/use-connection';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';

export const useWithdraw = () => {
  const { sender } = useConnection();
  const { vault: vaultAddress } = useParams(VaultPage);

  const withdraw = async (amount: string | number) => {
    if (!sender?.address) {
      return;
    }

    const vault = await getVault(Address.parse(vaultAddress));
    const sharesWallet = await getSharesWallet(vault, sender.address);

    const atomicAmount = toNano(amount);

    return await withdrawApi(sharesWallet, sender, atomicAmount);
  };

  return { withdraw };
};
