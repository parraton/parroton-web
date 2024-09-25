/* eslint-disable react/jsx-no-literals */
'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback } from 'react';
import { Vault } from './vault';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { vaults } = useVaults();

  const renderVaults = useCallback(
    (vaults: BackendVault[]) => (
      <div className='custom-card-wrapper'>
        <ul className='custom-card-list'>
          <li className='custom-card-list-item'>Deposit asset</li>
          <li className='custom-card-list-item'>You earn</li>
          <li className='custom-card-list-item'>Yield</li>
        </ul>
        {vaults.map((vault) => (
          <Vault key={vault.vaultAddress} lng={lng} vault={vault} />
        ))}
      </div>
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
