import { useMemo } from 'react';
import { useVaults } from './use-vaults';

export function useVaultData(vaultAddress: string) {
  const { error, isLoading, vaults } = useVaults();

  const vault = useMemo(
    () =>
      vaults ? vaults.find((vault) => vault.vaultAddressFormatted === vaultAddress) : undefined,
    [vaults, vaultAddress],
  );

  return { error, isLoading, vault };
}
