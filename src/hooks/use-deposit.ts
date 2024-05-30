import { deposit as depositApi, getVault, getLpWallet } from '@core';
import { toNano } from '@ton/core';
import { useConnection } from '@hooks/use-connection';

export const useDeposit = () => {
  const { sender } = useConnection();

  const deposit = async (amount: string | number) => {
    if (!sender?.address) {
      return;
    }

    const vault = await getVault();
    const investorLpWallet = await getLpWallet(sender.address);

    const atomicAmount = toNano(amount);

    return await depositApi(investorLpWallet, vault, sender, atomicAmount);
  };

  return { deposit };
};
