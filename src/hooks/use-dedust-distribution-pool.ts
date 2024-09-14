import { useCallback, useMemo } from 'react';
import { Address } from '@ton/core';
import { DistributionPool } from '@dedust/apiary-v1';
import { getVaultData } from '@core';
import { tonClient } from '@core/config';
import useSWR from 'swr';

export function useDedustDistributionPool(vaultAddress: string) {
  const getDistributionPoolAddress = useCallback(
    ([, vaultAddress]: [string, string]) =>
      getVaultData(Address.parse(vaultAddress)).then(
        ({ distributionPoolAddress }) => distributionPoolAddress,
      ),
    [],
  );
  const { data: distributionPoolAddress } = useSWR(
    ['dedust-distribution-pool', vaultAddress],
    getDistributionPoolAddress,
    { shouldRetryOnError: true, errorRetryInterval: 5000, suspense: false },
  );

  const distributionPool = useMemo(() => {
    if (!distributionPoolAddress) return null;

    const rawDistributionPool = DistributionPool.createFromAddress(distributionPoolAddress);

    return tonClient.open(rawDistributionPool);
  }, [distributionPoolAddress]);

  return { distributionPool };
}
