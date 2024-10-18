'use client';

import { Vault as BackendVault, useVaults } from '@hooks/use-vaults';
import { Language } from '@i18n/settings';
import { useCallback, useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { cn } from '@lib/utils';
import Lottie from 'react-lottie';
import { ActionLink } from './action-link';
import { miniAppLink } from '@config/links';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

import animationData from './duck-animation.json';

export const VaultsList = ({ lng }: { lng: Language }) => {
  const { replace } = useRouter();
  const { vaults, error } = useVaults();
  const { t } = useTranslation({ ns: 'vault-card' });
  const { t: commonT } = useTranslation({ ns: 'common' });
  const { balance: tonBalance } = useTonBalance();
  const { preferredCurrency } = usePreferredCurrency();
  const { tonPrice = FALLBACK_TON_PRICE } = useTonPrice();
  const [, initData] = useInitData();
  const [depositValue, setDepositValue] = useState(() =>
    new BigNumber(tonBalance ?? FALLBACK_MAX_ASSET_VALUE)
      .times(preferredCurrency === Currency.USD ? tonPrice : 1)
      .toString(),
  );

  const renderVaults = useCallback(
    (vaults: BackendVault[]) => (
      <>
        <h1 className='text-center text-2xl font-bold'>
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

        <div className='flex flex-col gap-2.5'>
          <ul className='custom-card-list'>
            {(['deposit_asset', 'you_earn', 'yield'] as const).map((i18nKey, i) => (
              <li
                key={i18nKey}
                className={cn('text-base font-normal text-[#8b9dad]', i === 2 && 'pr-1.5 text-end')}
              >
                {t(i18nKey)}
              </li>
            ))}
          </ul>
          {vaults.map((vault) => (
            <Vault key={vault.vaultAddress} lng={lng} vault={vault} depositValue={depositValue} />
          ))}
        </div>
      </>
    ),
    [depositValue, lng, t, tonBalance, tonPrice],
  );

  useEffect(() => {
    if (vaults?.length === 1) {
      replace(`/${lng}/${vaults[0].vaultAddress}`);
    }
  }, [lng, replace, vaults]);

  if (error) {
    return <div className='flex w-full justify-center'>{commonT('get_data_error')}</div>;
  }

  return vaults ? (
    <>
      {renderVaults(vaults)}

      <div className='glass-card flex w-full flex-col gap-4 p-4'>
        <h1 className='whitespace-pre-line text-center text-lg font-semibold'>
          {t('farm_open_league_airdrop')}
        </h1>

        <div className='flex w-full items-center justify-evenly gap-2'>
          <div className='h-auto w-[100px]'>
            <Lottie
              options={{
                loop: true,
                autoplay: true,
                animationData,
              }}
              height={100}
              width={100}
              isClickToPauseDisabled
            />
          </div>
          <ol className='list-decimal font-medium leading-10'>
            <li>
              <ActionLink href='https://society.ton.org/degen-airdrop'>
                {t('get_degen_badge')}
              </ActionLink>
            </li>
            <li>
              <ActionLink
                href={
                  initData
                    ? 'https://t.me/rainbow_swap_bot/app?startapp=bot'
                    : 'https://rainbow.ag/TON/USDT'
                }
              >
                {t('swap_any_tokens')}
              </ActionLink>
            </li>
            <li>
              {initData ? (
                <ActionLink href={`/${lng}/rewards`}>{t('earn_more_points')}</ActionLink>
              ) : (
                <ActionLink href={miniAppLink}>{t('earn_more_points_in_telegram')}</ActionLink>
              )}
            </li>
          </ol>
        </div>
      </div>
    </>
  ) : (
    <div className='flex w-full justify-center'>
      <div className='logo-loader animate-pulse' />
    </div>
  );
};
