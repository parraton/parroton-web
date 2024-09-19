import { useEffect, useState } from 'react';
import { getWallet } from '@core';
import { Address, fromNano } from '@ton/core';
import { Asset as BackendAsset } from './use-vaults';
import { useTonAddress } from '@tonconnect/ui-react';

export function useJettonsBalances(assets: BackendAsset[] = []) {
  const sender = useTonAddress();
  const [balances, setBalances] = useState<string[] | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!sender) return;
      try {
        const newBalances = await Promise.all(
          assets.map(async ({ address }) => {
            try {
              const wallet = await getWallet(Address.parse(sender), Address.parse(address));
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
  }, [assets, sender]);

  return { balances };
}
