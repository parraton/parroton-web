'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback, useEffect } from 'react';
import { Vault } from './vault';
import { useRouter } from 'next/navigation';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { replace } = useRouter();
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

  useEffect(() => {
    if (vaults?.length === 1) {
      replace(`/${lng}/${vaults[0].vaultAddress}`);
    }
  }, [lng, replace, vaults]);

  return vaults ? (
    renderVaults(vaults)
  ) : (
    <div className='flex w-full justify-center'>
      <div className='logo-loader animate-pulse' />
    </div>
  );
};
