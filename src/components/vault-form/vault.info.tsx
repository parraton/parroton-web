/* eslint-disable react/jsx-no-literals */
'use client';

import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { OrLoader } from '@components/loader/loader';
import { ReactNode, useCallback, useMemo } from 'react';
import { useTranslation } from '@i18n/client';
import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { KpiDialog } from '@components/kpi/kpi-dialog';
import { GlassCard } from '@components/glass-card';
import { useVaultData } from '@hooks/use-vault-data';
import { useTonPrice } from '@hooks/use-ton-price';
import BigNumber from 'bignumber.js';
import { multiplyIfPossible } from '@utils/multiply-if-possible';

const useVaultInfo = () => {
  const { vault: vaultAddress, lng } = useParams(VaultPage);
  const { vault, error: vaultError } = useVaultData(vaultAddress);
  const { tonPrice, error: tonPriceError } = useTonPrice();
  const pendingReinvestUSD = vault?.pendingRewardsUSD;

  const poolNumbers = useMemo(
    () => ({
      tvlInUsd: vault?.tvlUsd,
      priceForOne: vault?.lpPriceUsd,
      apy: vault?.apy,
      pendingReinvest: pendingReinvestUSD
        ? {
            usd: pendingReinvestUSD,
            ton:
              typeof tonPrice === 'number'
                ? formatNumber(
                    new BigNumber(pendingReinvestUSD)
                      .div(tonPrice)
                      .decimalPlaces(2, BigNumber.ROUND_FLOOR)
                      .toString(),
                    lng,
                  )
                : undefined,
          }
        : undefined,
      extraApr: '0',
    }),
    [vault, tonPrice, lng, pendingReinvestUSD],
  );

  const metadata = vault?.lpMetadata;
  const { balance: sharesBalance, error: sharesBalanceError } = useSharesBalance(vaultAddress);
  const lpBalance = sharesBalance?.lpBalance;
  const vaultLoading = !vaultError && !vault;
  const tonPriceLoading = !tonPriceError && tonPrice == null;
  const sharesBalanceLoading = !sharesBalanceError && (sharesBalance === undefined);

  return {
    vaultLoading,
    pendingReinvestLoading: vaultLoading || tonPriceLoading,
    depositedLoading: vaultLoading || sharesBalanceLoading,
    sharesBalance: lpBalance
      ? { lp: lpBalance, usd: multiplyIfPossible(lpBalance, poolNumbers.priceForOne) }
      : undefined,
    metadata,
    poolNumbers,
    kpis: vault?.kpis,
    lng,
  };
};

const NanoInfoPlate = ({
  title,
  value,
  tooltip,
  tooltipTitle,
}: {
  title: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  tooltipTitle?: string;
}) => (
  <GlassCard className={cn('relative flex gap-2', { 'z-20': tooltip })}>
    <div className='flex-1 p-3'>
      <div
        className={cn(
          {
            ['custom-list-header']: tooltip,
          },
          'text-l z-20 font-semibold text-[#848484]',
        )}
      >
        {title}
        {tooltip && (
          <span className='custom-tooltip'>
            {tooltipTitle} {tooltip}
          </span>
        )}
      </div>
      <div className={'text-sm font-bold'}>{value}</div>
    </div>
  </GlassCard>
);

export function VaultInfo() {
  const { sharesBalance, metadata, poolNumbers, kpis, lng, vaultLoading, pendingReinvestLoading, depositedLoading } = useVaultInfo();
  const { t } = useTranslation({ ns: 'vault-card' });
  const { apy, extraApr } = poolNumbers;

  const totalRewardPercent =
    apy != null && extraApr != null ? Number(apy) + Number(extraApr) : undefined;

  const pendingReinvestModifier = useCallback(
    ({ usd, ton }: { usd: string; ton: string | undefined }) => {
      const dollarEquivalent = formatCurrency(usd, lng);

      return ton ? `${formatNumber(ton, lng)} TON (${dollarEquivalent})` : dollarEquivalent;
    },
    [lng],
  );

  const sharesBalanceModifier = useCallback(
    ({
      sharesBalance,
      currency,
    }: {
      sharesBalance: { lp: string; usd: number | undefined };
      currency: string;
    }) => {
      const parsedBalance = new BigNumber(sharesBalance.lp);
      let lpBalance: string;

      if (parsedBalance.gte(1e6)) {
        lpBalance = parsedBalance.integerValue(BigNumber.ROUND_FLOOR).toString();
      } else if (parsedBalance.gte(1)) {
        // Leave 7 significant digits
        const exponent = parsedBalance.e ?? 0;

        lpBalance = parsedBalance
          .shiftedBy(-exponent)
          .decimalPlaces(6, BigNumber.ROUND_FLOOR)
          .shiftedBy(exponent)
          .toString();
      } else if (parsedBalance.lte(1e-6) && parsedBalance.gt(0)) {
        lpBalance = `< ${formatNumber(1e-6, lng)}`;
      } else {
        lpBalance = parsedBalance.decimalPlaces(6, BigNumber.ROUND_FLOOR).toString();
      }
      lpBalance = formatNumber(lpBalance, lng);

      return sharesBalance.usd
        ? `${lpBalance} ${currency} (${formatCurrency(sharesBalance.usd, lng)})`
        : `${lpBalance} ${currency}`;
    },
    [lng],
  );

  return (
    <div className={'g flex flex-col gap-4'}>
      <h1
        className={
          'grid scroll-m-20 place-items-center gap-x-1 text-4xl font-medium tracking-tight md:flex'
        }
      >
        <OrLoader
          animation={vaultLoading}
          value={
            metadata?.name && (
              <>
                <span className='text-sm md:text-4xl'>{`${metadata?.name.split(':')[0]}:`}</span>
                <span className='text-xl md:text-4xl'>{metadata?.name.split(':')[1]}</span>
              </>
            )
          }
        />
      </h1>
      {/**/}
      <KpiDialog values={kpis} lng={lng} />
      <div className='custom-list !gap-2'>
        <NanoInfoPlate
          title={t('tvl')}
          value={
            <OrLoader
              animation={vaultLoading}
              value={poolNumbers.tvlInUsd}
              modifier={(x) => formatCurrency(x)}
            />
          }
        />
        <NanoInfoPlate
          title={t('apy')}
          value={
            <OrLoader
              animation={vaultLoading}
              value={totalRewardPercent}
              modifier={(x) => formatPercentage(x, lng)}
            />
          }
        />
        <NanoInfoPlate
          title={t('pending_reinvest')}
          value={
            <OrLoader
              animation={pendingReinvestLoading}
              value={poolNumbers.pendingReinvest}
              modifier={pendingReinvestModifier}
            />
          }
          tooltip={<span className='block w-48 text-wrap'>{t('reinvest_tooltip')}</span>}
        />
        <NanoInfoPlate
          title={t('deposited')}
          value={
            <OrLoader
              animation={depositedLoading}
              value={
                sharesBalance && metadata?.symbol
                  ? {
                      sharesBalance,
                      currency: metadata?.symbol,
                    }
                  : undefined
              }
              modifier={sharesBalanceModifier}
            />
          }
        />
      </div>
    </div>
  );
}
