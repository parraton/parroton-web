'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback } from 'react';
import { Vault } from './vault';
import Link from 'next/link';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { vaults } = useVaults();

  const renderVaults = useCallback(
    (vaults: BackendVault[]) => (
      <>
        {vaults.map((vault) => (
          <Vault key={vault.vaultAddress} lng={lng} vault={vault} />
        ))}
        {/* eslint-disable-next-line react/jsx-no-literals */}
        <Link className='custom-wrapper text-blue-500 underline' href={`/${lng}/rewards`}>
          Rewards
        </Link>
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
