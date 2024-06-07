import { DistributionPool } from '@dedust/apiary-v1';
import { tonClient } from '@core/config';
import { OpenedContract } from '@ton/core';
import { useEffect, useState } from 'react';
import { addresses } from '@config/contracts-config';

export const getVaultDistributionPool = (vaultAddress: string) => {
  const vault = addresses.vaults.find(({ vault }) => vault.toString() === vaultAddress);

  if (!vault) {
    throw new Error(`Vault ${vaultAddress} not found'`);
  }
  const rawDistributionPool = DistributionPool.createFromAddress(vault.extraDistributionPool);
  return tonClient.open(rawDistributionPool);
};

export function useVaultDistributionPool(vaultAddress: string) {
  const [distributionPool, setDistributionPool] = useState<OpenedContract<DistributionPool> | null>(
    null,
  );

  useEffect(() => {
    (async () => {
      const distributionPool = getVaultDistributionPool(vaultAddress);
      setDistributionPool(distributionPool);
    })();
  }, [vaultAddress]);

  return { distributionPool };
}
