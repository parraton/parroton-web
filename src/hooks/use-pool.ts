import { useCallback } from 'react';
import { Address } from '@ton/core';
import { getStrategyInfoByVault } from '@core';
import useSWR from 'swr';

export function usePool(vaultAddress: string) {
  const getPoolAddress = useCallback(([, vaultAddress]: [string, string]) => {
    return getStrategyInfoByVault(Address.parse(vaultAddress)).then(
      ({ poolAddress }) => poolAddress,
    );
  }, []);

  const { data: poolAddress } = useSWR(['pool', vaultAddress], getPoolAddress, {
    shouldRetryOnError: true,
    errorRetryInterval: 5000,
    suspense: false,
  });

  return {
    pool: poolAddress ?? null,
  };
}
