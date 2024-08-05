import { getVaultData } from '@core';
import { Address } from '@ton/core';
import useSWR from 'swr';

export function useManagementFee(vaultAddress: string) {
  const { data, error } = useSWR(['useManagementFee', vaultAddress], async () => {
    const { managementFee } = await getVaultData(Address.parse(vaultAddress));
    return managementFee;
  });

  return {
    managementFee: data,
    error,
  };
}
