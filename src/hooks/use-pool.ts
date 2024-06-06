import { useEffect, useState } from 'react';
import { Address } from '@ton/core';
import { getStrategyInfoByVault } from '@core';

export function usePool(vaultAddress: string) {
  const [poolAddress, setPoolAddress] = useState<Address | null>(null);

  useEffect(() => {
    getStrategyInfoByVault(Address.parse(vaultAddress)).then(({ poolAddress }) => {
      setPoolAddress(poolAddress);
    });
  }, [vaultAddress]);

  return {
    pool: poolAddress,
  };
}
