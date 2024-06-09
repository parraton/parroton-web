import { useConnection } from '@hooks/use-connection';
import { Address, fromNano } from '@ton/core';
import useSWR from 'swr';
import { getLpWallet } from '@core';
import { usePool } from '@hooks/use-pool';

export const getLpBalance = async (senderAddress: Address, poolAddress: Address) => {
  const lpWallet = await getLpWallet(senderAddress, poolAddress);
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

      return await getLpBalance(sender.address, pool);
    },
    { refreshInterval: 5000 },
  );

  return {
    balance: data,
    error,
  };
};
