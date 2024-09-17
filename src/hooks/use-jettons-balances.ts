import { useEffect, useState } from 'react';
import { getWallet } from '@core';
import { Address, fromNano } from '@ton/core';
import { useConnection } from '@hooks/use-connection';
import { Asset as BackendAsset } from './use-vaults';

export function useJettonsBalances(assets: BackendAsset[] = []) {
  const { sender } = useConnection();
  const [balances, setBalances] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!sender.address) return;
      try {
        const senderAddress = sender.address;

        const newBalances = await Promise.all(
          assets.map(async ({ address }) => {
            try {
              const wallet = await getWallet(senderAddress, Address.parse(address));
              const rawBalance = await wallet.getBalance();

              return fromNano(rawBalance);
            } catch (error) {
              if ((error as Error)?.message.includes('-256')) {
                return '0';
              }

              throw error;
            }
          }),
        );
        setBalances(newBalances as [string, string]);
      } catch (error) {
        console.error(error);
      }
    };

    void fetchBalance();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, sender.address?.toString()]);

  return { balances };
}
