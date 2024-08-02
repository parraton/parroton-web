import { getVaultData } from '@core';
import { Address } from '@ton/core';
import useSWR from 'swr';
import { usePool } from '@hooks/use-pool';
import { getSupply } from '@hooks/use-vault-tvl';

export function useShare(vaultAddress: string) {
  const { pool } = usePool(vaultAddress);

  const { data, error } = useSWR(['useShare', vaultAddress, Boolean(pool)], async () => {
    if (!pool) return null;

    const { depositedLp } = await getVaultData(Address.parse(vaultAddress));
    const poolSupply = await getSupply(pool);

    return String(Number(depositedLp) / Number(poolSupply));
  });

  return {
    share: data,
    error,
  };
}
