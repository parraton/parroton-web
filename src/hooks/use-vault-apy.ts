import { useDedustDistributionPool } from '@hooks/use-dedust-distribution-pool';
import { useVaultDistributionPool } from '@hooks/use-vault-distribution-pool';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { calculateApy } from '@utils/calculate-apy';
import { getDedustRewards, getVaultRewards } from '@core';

const percentage = 100;
const countOfReinvests = 365;
const numberOfWeeks = 52;

export const useVaultApy = (vaultAddress: string, tvlData?: { tvlInTon: string }) => {
  const { distributionPool: dedustDistributionPool } = useDedustDistributionPool(vaultAddress);
  const { distributionPool: vaultDistributionPool } = useVaultDistributionPool(vaultAddress);

  const [apy, setApy] = useState<string | null>(null);

  const { data: dedustRewards, error } = useSWR(
    ['dedust-rewards', vaultAddress, Boolean(dedustDistributionPool)],
    async () => {
      if (!dedustDistributionPool) return;

      return await getDedustRewards(vaultAddress, dedustDistributionPool);
    },
    {
      refreshInterval: 10_000,
    },
  );

  const { data: vaultRewards } = useSWR(
    ['vault-rewards', vaultAddress, Boolean(vaultDistributionPool)],
    async () => {
      if (!vaultDistributionPool) return;

      return await getVaultRewards(vaultDistributionPool);
    },
    {
      refreshInterval: 10_000,
    },
  );

  useEffect(() => {
    if (!tvlData || !dedustRewards || !vaultRewards) return;
    if (dedustRewards && vaultRewards) {
      console.log({ dedustRewards, vaultRewards });
    }
    const rewards = Number(dedustRewards) + Number(vaultRewards);

    const apr = (rewards / Number(tvlData.tvlInTon)) * numberOfWeeks * percentage;

    const vaultAddressToApr = Buffer.from(vaultAddress).reduce((acc, byte) => acc + byte, 0);

    const aprForDemo = Math.min(apr, vaultAddressToApr % 500);

    setApy(calculateApy(aprForDemo, countOfReinvests).toFixed(2));
  }, [dedustRewards, vaultRewards, tvlData, vaultAddress]);

  return {
    apyData: {
      apy,
      daily: apy ? (Number(apy) / countOfReinvests).toFixed(2) : undefined,
    },
    error,
  };
};
