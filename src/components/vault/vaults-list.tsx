'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback } from 'react';
import { Vault } from './vault';
import { useTranslation } from '@i18n/client';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { t } = useTranslation({ ns: 'common', lng });
  const { vaults, error } = useVaults();

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

  if (error) {
    return <div className='flex w-full justify-center'>{t('get_data_error')}</div>;
  }

  return vaults ? (
    renderVaults(vaults)
  ) : (
    <div className='flex w-full justify-center'>
      <div className='logo-loader animate-pulse' />
    </div>
  );
};
