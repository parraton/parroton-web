import { useEffect, useState } from 'react';
import { Address, OpenedContract } from '@ton/core';
import { DistributionPool } from '@dedust/apiary-v1';
import { getVaultData } from '@core';
import { tonClient } from '@core/config';

export function useDedustDistributionPool(vaultAddress: string) {
  const [distributionPool, setDistributionPool] = useState<OpenedContract<DistributionPool> | null>(
    null,
  );

  useEffect(() => {
    const fetchDistributionPool = async () => {
      const { distributionPoolAddress } = await getVaultData(Address.parse(vaultAddress));
      const rawDistributionPool = DistributionPool.createFromAddress(distributionPoolAddress);
      const distributionPool = tonClient.open(rawDistributionPool);
      setDistributionPool(distributionPool);
    };

    void fetchDistributionPool();
  }, [vaultAddress]);

  return { distributionPool };
}
