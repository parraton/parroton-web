'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback } from 'react';
import { Vault } from './vault';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { vaults } = useVaults();

  const renderVaults = useCallback(
    (vaults: BackendVault[]) => (
      <>
        {vaults.map((vault) => (
          <Vault key={vault.vaultAddress} lng={lng} vault={vault} />
        ))}
      </>
    ),
    [lng],
  );

  return vaults ? (
    renderVaults(vaults)
  ) : (
    <div className='flex w-full justify-center'>
      <div className='logo-loader animate-pulse' />
    </div>
  );
};
