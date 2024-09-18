import { getSharesWallet, getVault } from '@core';
import useSWR from 'swr';
import { Address, fromNano } from '@ton/core';
import { useTonAddress } from '@tonconnect/ui-react';
import { isAddressDefined } from '@utils/is-address-defined';

const getSharesBalance = async (senderAddress: Address, vaultAddress: Address) => {
  const vault = await getVault(vaultAddress);
  const sharesWallet = await getSharesWallet(vault, senderAddress);
  const data = await sharesWallet.getWalletData();
  const lpBalance = await vault.getEstimatedLpAmount(data.balance);

  return {
    sharesBalance: fromNano(data.balance),
    lpBalance: fromNano(lpBalance),
  };
};

export const useSharesBalance = (vaultAddress: string) => {
  const walletAddress = useTonAddress();

  const { data, error } = useSWR(
    ['sharesBalance', walletAddress, vaultAddress],
    async () => {
      if (!isAddressDefined(walletAddress)) return null;
      try {
        return await getSharesBalance(Address.parse(walletAddress), Address.parse(vaultAddress));
      } catch (error) {
        if ((error as Error)?.message.includes('-256')) {
          return {
            sharesBalance: '0',
            lpBalance: '0',
          };
        } else {
          throw error;
        }
      }
    },
    { refreshInterval: 10_000 },
  );

  return {
    balance: data,
    error,
  };
};
