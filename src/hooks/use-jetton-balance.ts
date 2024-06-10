import { useEffect, useState } from 'react';
import { getStrategyInfoByVault, getWallet } from '@core';
import { Address, fromNano } from '@ton/core';
import { useConnection } from '@hooks/use-connection';

export function useJettonBalance(vaultAddress: string) {
  const { sender } = useConnection();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!sender.address) return;
      const { jettonMasterAddress } = await getStrategyInfoByVault(Address.parse(vaultAddress));
      const wallet = await getWallet(sender.address, jettonMasterAddress);

      const rawBalance = await wallet.getBalance();

      const balance = fromNano(rawBalance);

      setBalance(balance);
    };

    void fetchBalance();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vaultAddress, sender.address?.toString()]);

  return { balance };
}
