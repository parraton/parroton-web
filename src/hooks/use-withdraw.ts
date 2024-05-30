import { getSharesWallet, getVault, withdraw as withdrawApi } from '@core';
import { toNano } from '@ton/core';
import { useConnection } from '@hooks/use-connection';

export const useWithdraw = () => {
  const { sender } = useConnection();

  const withdraw = async (amount: string | number) => {
    if (!sender?.address) {
      return;
    }

    const vault = await getVault();
    const sharesWallet = await getSharesWallet(vault, sender.address);

    const atomicAmount = toNano(amount);

    return await withdrawApi(sharesWallet, sender, atomicAmount);
  };

  return { withdraw };
};
