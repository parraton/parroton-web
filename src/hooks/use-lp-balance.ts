import { Address, fromNano } from '@ton/core';
import useSWR from 'swr';
import { getWallet } from '@core';
import { usePool } from '@hooks/use-pool';
import { useTonAddress } from '@tonconnect/ui-react';

const getLpBalance = async (senderAddress: Address, poolAddress: Address) => {
  const lpWallet = await getWallet(senderAddress, poolAddress);
  const data = await lpWallet.getWalletData();

  //TODO: fix decimals
  return fromNano(data.balance);
};

export const useLpBalance = (vaultAddress: string) => {
  const walletAddress = useTonAddress();

  const { pool } = usePool(vaultAddress);

  const { data, error } = useSWR(
    ['lpBalance', walletAddress, vaultAddress, Boolean(pool)],
    async () => {
      if (!walletAddress || !pool) return null;
      try {
        const address = Address.parse(walletAddress);
        return await getLpBalance(address, pool);
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
