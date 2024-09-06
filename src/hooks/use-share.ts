import { getVaultData } from '@core';
import { Address } from '@ton/core';
import useSWR from 'swr';
import { useVaultData } from './use-vault-data';

export function useShare(vaultAddress: string) {
  const { vault } = useVaultData(vaultAddress);

  const { data, error } = useSWR(['useShare', vaultAddress, Boolean(vault)], async () => {
    if (!vault) return null;

    const { depositedLp } = await getVaultData(Address.parse(vaultAddress));

    return String(Number(depositedLp) / Number(vault.lpTotalSupply));
  });

  return {
    share: data,
    error,
  };
}
