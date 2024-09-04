import useSWR from 'swr';

import { useTonPrice } from '@hooks/use-ton-price';
import { useDedustDistributionPool } from '@hooks/use-dedust-distribution-pool';
import { tonClient } from '@core/config';
import { Address, fromNano } from '@ton/core';
import { JettonRoot } from '@dedust/sdk';
import { usePool } from '@hooks/use-pool';

export const getSupply = async (pool: Address) => {
  const rawJetton = JettonRoot.createFromAddress(pool);
  const jetton = tonClient.open(rawJetton);
  const { totalSupply } = await jetton.getJettonData();

  return totalSupply;
};

export const useVaultTvl = (vaultAddress: string) => {
  const { tonPrice } = useTonPrice();
  const { distributionPool } = useDedustDistributionPool(vaultAddress);
  const { pool } = usePool(vaultAddress);

  const { data: tvlData, error } = useSWR(
    ['vault-numbers', vaultAddress, tonPrice, Boolean(distributionPool), Boolean(pool)],
    async () => {
      if (!distributionPool || !pool) return;

      const {
        last: { seqno },
      } = await tonClient.getLastBlock();

      const { account } = await tonClient.getAccountLite(seqno, Address.parse(vaultAddress));

      const balance = fromNano(account.balance.coins);

      const tvl = Number(balance) * 2;

      const poolTvl = tvl * Number(tonPrice);

      const supply = Number(fromNano(await getSupply(pool)));

      return {
        tvlInTon: `${tvl}`,
        tvlInUsd: `${poolTvl}`,
        priceForOne: supply ? `${poolTvl / supply}` : 0,
      };
    },
    {
      refreshInterval: 10_000,
    },
  );

  return { tvlData, error };
};
