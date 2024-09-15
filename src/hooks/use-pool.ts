import { useMemo } from 'react';
import { Address } from '@ton/core';
import { useVaults } from './use-vaults';

export function usePool(vaultAddress: string) {
  const { vaults } = useVaults();

  const poolAddress = useMemo(() => {
    const vault = vaults?.find((vault) => vault.vaultAddressFormatted === vaultAddress);

    return vault ? Address.parse(vault.lpMetadata.address) : null;
  }, [vaultAddress, vaults]);

  return {
    pool: poolAddress ?? null,
  };
}
