import { useTonPrice } from '@hooks/use-ton-price';
import { useDedustDistributionPool } from '@hooks/use-dedust-distribution-pool';
import useSWR from 'swr';
import { tonClient } from '@core/config';
import { Address, fromNano } from '@ton/core';

export const useVaultTvl = (vaultAddress: string) => {
  const { tonPrice } = useTonPrice();
  const { distributionPool } = useDedustDistributionPool(vaultAddress);

  const { data: tvlData, error } = useSWR(
    ['vault-numbers', vaultAddress, tonPrice, Boolean(distributionPool)],
    async () => {
      if (!distributionPool) return;

      const {
        last: { seqno },
      } = await tonClient.getLastBlock();

      const { account } = await tonClient.getAccountLite(seqno, Address.parse(vaultAddress));

      const balance = fromNano(account.balance.coins);

      const tvl = Number(balance) * 2;

      const poolTvl = tvl * Number(tonPrice);

      console.log({ tvlInTon: tvl });

      return {
        tvlInTon: `${tvl}`,
        tvlInUsd: `${poolTvl}`,
      };
    },
    {
      refreshInterval: 10_000,
    },
  );

  return { tvlData, error };
};
