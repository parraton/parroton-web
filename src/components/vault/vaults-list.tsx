'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback, useState } from 'react';
import { Vault } from './vault';
import { useTranslation } from '@i18n/client';
import { AssetAmountInputV2 } from '../ui/asset-amount-input-v2';
import { useTonBalance } from '@hooks/use-ton-balance';
import { FALLBACK_MAX_ASSET_VALUE, FALLBACK_TON_PRICE } from '@lib/constants';
import { useTonPrice } from '@hooks/use-ton-price';
import { Trans } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { Currency } from '@types';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { vaults } = useVaults();
  const { t } = useTranslation({ ns: 'vault-card' });
  const { balance: tonBalance } = useTonBalance();
  const { preferredCurrency } = usePreferredCurrency();
  const { tonPrice = FALLBACK_TON_PRICE } = useTonPrice();
  const [depositValue, setDepositValue] = useState(() =>
    new BigNumber(tonBalance ?? FALLBACK_MAX_ASSET_VALUE)
      .times(preferredCurrency === Currency.USD ? tonPrice : 1)
      .toString(),
  );

  const renderVaults = useCallback(
    (vaults: BackendVault[]) => (
      <>
        <h1 className='text-center text-3xl font-bold'>
          <Trans
            i18nKey='vault-card:put_your_liquidity_at_work'
            components={{ 1: <span className='text-custom-link' /> }}
          />
        </h1>

        <AssetAmountInputV2
          maxValueInAsset={tonBalance ?? FALLBACK_MAX_ASSET_VALUE}
          assetDecimalPlaces={2}
          assetSymbol='TON'
          assetExchangeRate={tonPrice}
          shouldShowActualAssetPostfix={false}
          value={depositValue}
          label={t('you_deposit')}
          onChange={setDepositValue}
        />

        <ul className='custom-card-list'>
          <li className='custom-card-list-item'>{t('deposit_asset')}</li>
          <li className='custom-card-list-item'>{t('you_earn')}</li>
          <li className='custom-card-list-item'>{t('yield')}</li>
        </ul>
        {vaults.map((vault) => (
          <Vault key={vault.vaultAddress} lng={lng} vault={vault} depositValue={depositValue} />
        ))}
      </>
    ),
    [depositValue, lng, t, tonBalance, tonPrice],
  );

  return vaults ? (
    renderVaults(vaults)
  ) : (
    <div className='flex w-full justify-center'>
      <div className='logo-loader animate-pulse' />
    </div>
  );
};
