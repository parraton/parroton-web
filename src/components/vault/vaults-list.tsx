'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback, useState } from 'react';
import { Vault } from './vault';
import Link from 'next/link';
import { useTranslation } from '@i18n/client';
import { DepositValueInput } from './deposit-value-input';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { vaults } = useVaults();
  const { t } = useTranslation({ ns: 'vault-card' });
  const [depositValue, setDepositValue] = useState('1000');

  const renderVaults = useCallback(
    (vaults: BackendVault[]) => (
      <>
        <h1 className='mt-5 text-center text-3xl font-bold'>{t('put_your_liquidity_at_work')}</h1>

        <DepositValueInput value={depositValue} onChange={setDepositValue} />

        <ul className='custom-card-list'>
          <li className='custom-card-list-item'>{t('deposit_asset')}</li>
          <li className='custom-card-list-item'>{t('you_earn')}</li>
          <li className='custom-card-list-item'>{t('yield')}</li>
        </ul>
        {vaults.map((vault) => (
          <Vault key={vault.vaultAddress} lng={lng} vault={vault} depositValue={depositValue} />
        ))}
        {/* eslint-disable-next-line react/jsx-no-literals */}
        <Link className='custom-link' href={`/${lng}/rewards`}>
          Rewards
        </Link>
      </>
    ),
    [depositValue, lng, t],
  );

  return vaults ? (
    renderVaults(vaults)
  ) : (
    <div className='mt-5 flex w-full justify-center'>
      <div className='logo-loader animate-pulse' />
    </div>
  );
};
