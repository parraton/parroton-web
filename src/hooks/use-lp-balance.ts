import { useConnection } from '@hooks/use-connection';
import { Address, fromNano } from '@ton/core';
import useSWR from 'swr';
import { getWallet } from '@core';
import { usePool } from '@hooks/use-pool';

const getLpBalance = async (senderAddress: Address, poolAddress: Address) => {
  const lpWallet = await getWallet(senderAddress, poolAddress);
  const data = await lpWallet.getWalletData();

  //TODO: fix decimals
  return fromNano(data.balance);
};

export const useLpBalance = (vaultAddress: string) => {
  const { sender } = useConnection();

  const { pool } = usePool(vaultAddress);

  const { data, error } = useSWR(
    ['lpBalance', sender.address?.toString(), vaultAddress, Boolean(pool)],
    async () => {
      if (!sender.address || !pool) return null;
      try {
        return await getLpBalance(sender.address, pool);
      } catch (error) {
        if ((error as Error)?.message.includes('-256')) {
          return '0';
        } else {
          throw error;
        }
      }
    },
    { refreshInterval: 5000 },
  );

  return {
    balance: data,
    error,
  };
};
