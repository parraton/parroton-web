import { getSharesWallet, getVault } from '@core';
import { useConnection } from '@hooks/use-connection';
import useSWR from 'swr';
import { Address, fromNano } from '@ton/core';

const getSharesBalance = async (senderAddress: Address, vaultAddress: Address) => {
  const vault = await getVault(vaultAddress);
  const sharesWallet = await getSharesWallet(vault, senderAddress);
  const data = await sharesWallet.getWalletData();

  //TODO: fix decimals
  return fromNano(data.balance);
};

export const useSharesBalance = (vaultAddress: string) => {
  const { sender } = useConnection();

  const { data, error } = useSWR(
    ['sharesBalance', sender.address?.toString(), vaultAddress],
    async () => {
      if (!sender.address) return null;
      try {
        return await getSharesBalance(sender.address, Address.parse(vaultAddress));
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
