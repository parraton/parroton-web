'use client';

import { GlassCard } from '@components/glass-card';
import { OrLoader } from '@components/loader/loader';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { useTonPrice } from '@hooks/use-ton-price';
import { useVaultData } from '@hooks/use-vault-data';
import { useTranslation } from '@i18n/client';
import { Language } from '@i18n/settings';
import { FALLBACK_TON_PRICE } from '@lib/constants';
import { formatCurrency, formatNumberWithDigitsLimit, formatPercentage } from '@lib/utils';
import { Currency } from '@types';
import BigNumber from 'bignumber.js';
import { useCallback, useMemo } from 'react';

interface Props {
  lng: Language;
  vaultAddress: string;
}

const useVaultStatsData = (lng: Language, vaultAddress: string) => {
  const { preferredCurrency } = usePreferredCurrency();
  const { tonPrice, error: tonPriceError } = useTonPrice();
  const { vault, error: vaultError } = useVaultData(vaultAddress);

  const toFormattedAmount = useCallback(
    (usdAmount: string | undefined) => {
      if (usdAmount === undefined) {
        return;
      }

      if (preferredCurrency === Currency.USD) {
        return formatCurrency(usdAmount, lng);
      }

      return tonPrice === undefined
        ? undefined
        : `${formatNumberWithDigitsLimit(new BigNumber(usdAmount).div(tonPrice ?? FALLBACK_TON_PRICE), lng, 4)} TON`;
    },
    [lng, preferredCurrency, tonPrice],
  );

  const formattedTvl = useMemo(() => toFormattedAmount(vault?.tvlUsd), [toFormattedAmount, vault]);
  const formattedReinvestAmount = useMemo(
    () => toFormattedAmount(vault?.pendingRewardsUSD),
    [toFormattedAmount, vault],
  );
  const tonPriceLoading =
    preferredCurrency === Currency.Tokens && tonPrice === undefined && !tonPriceError;
  const vaultIsLoading = !vaultError && !vault;

  return {
    apy: vault ? formatPercentage(vault.apy, lng) : undefined,
    formattedTvl,
    formattedReinvestAmount,
    apyIsLoading: vaultIsLoading,
    tvlIsLoading: vaultIsLoading || tonPriceLoading,
    reinvestAmountIsLoading: vaultIsLoading || tonPriceLoading,
  };
};

interface NanoInfoPlateProps {
  name: string;
  value: string | undefined;
  isLoading: boolean;
}

const NanoInfoPlate = ({ name, value, isLoading }: NanoInfoPlateProps) => (
  <div className='flex flex-col gap-1 text-center leading-tight'>
    <div className='flex justify-center'>
      <OrLoader
        animation={isLoading}
        value={value}
        modifier={(value) => <p className='text-lg font-semibold'>{value}</p>}
      />
    </div>
    <p className='text-sm'>{name}</p>
  </div>
);

export const VaultStats = ({ lng, vaultAddress }: Props) => {
  const { t } = useTranslation({ lng, ns: 'form' });
  const { t: vaultCardT } = useTranslation({ lng, ns: 'vault-card' });
  const {
    apy,
    formattedTvl,
    formattedReinvestAmount,
    apyIsLoading,
    tvlIsLoading,
    reinvestAmountIsLoading,
  } = useVaultStatsData(lng, vaultAddress);

  return (
    <div className='flex flex-col gap-1'>
      <p className='text-lg font-semibold leading-tight'>{t('stats')}</p>

      <GlassCard className='custom-info-list py-4'>
        <NanoInfoPlate name={vaultCardT('tvl')} value={formattedTvl} isLoading={tvlIsLoading} />
        <NanoInfoPlate
          name={vaultCardT('pending_reinvest')}
          value={formattedReinvestAmount}
          isLoading={reinvestAmountIsLoading}
        />
        <NanoInfoPlate name={vaultCardT('apy')} value={apy} isLoading={apyIsLoading} />
      </GlassCard>
    </div>
  );
};
