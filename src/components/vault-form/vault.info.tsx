/* eslint-disable react/jsx-no-literals */
'use client';

import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { OrLoader } from '@components/loader/loader';
import { ReactNode, useMemo } from 'react';
import { useTranslation } from '@i18n/client';
import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { KpiDialog } from '@components/kpi/kpi-dialog';
import { GlassCard } from '@components/glass-card';
import { useRevenue } from '@hooks/use-revenue';
import { useShare } from '@hooks/use-share';
import { useVaultData } from '@hooks/use-vault-data';
import { useTonPrice } from '@hooks/use-ton-price';
import BigNumber from 'bignumber.js';

const useVaultInfo = () => {
  const { vault: vaultAddress, lng } = useParams(VaultPage);
  const { vault } = useVaultData(vaultAddress);
  const { tonPrice } = useTonPrice();
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
  const { balance: sharesBalance } = useSharesBalance(vaultAddress);
  const { revenue } = useRevenue(vaultAddress);
  const { share } = useShare(vaultAddress);

  return { sharesBalance: sharesBalance?.lpBalance, metadata, poolNumbers, lng, revenue, share };
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
  const { sharesBalance, metadata, poolNumbers, revenue, share, lng } = useVaultInfo();
  const { t } = useTranslation({ ns: 'vault-card' });
  const { apy, extraApr } = poolNumbers;

  const totalRewardPercent =
    apy != null && extraApr != null ? Number(apy) + Number(extraApr) : undefined;

  return (
    <div className={'g flex flex-col gap-4'}>
      <h1
        className={
          'grid scroll-m-20 place-items-center gap-x-1 text-4xl font-medium tracking-tight md:flex'
        }
      >
        <OrLoader
          animation
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
      <KpiDialog tvl={poolNumbers.tvlInUsd!} share={share!} revenue={revenue?.toString()!} />
      <div className='custom-list !gap-2'>
        <NanoInfoPlate
          title={t('tvl')}
          value={
            <OrLoader animation value={poolNumbers.tvlInUsd} modifier={(x) => formatCurrency(x)} />
          }
        />
        <NanoInfoPlate
          title={t('apy')}
          value={
            <OrLoader
              animation
              value={totalRewardPercent}
              modifier={(x) => formatPercentage(x, lng)}
            />
          }
        />
        <NanoInfoPlate
          title={t('pending_reinvest')}
          value={
            <OrLoader
              animation
              value={poolNumbers.pendingReinvest}
              modifier={({ usd, ton }) =>
                ton
                  ? `${formatNumber(ton, lng)} TON (${formatCurrency(usd, lng)})`
                  : `${formatCurrency(usd, lng)}`
              }
            />
          }
          tooltip={<span className='block w-80 text-wrap'>{t('reinvest_tooltip')}</span>}
        />
        <NanoInfoPlate
          title={t('deposited')}
          value={
            <OrLoader
              value={
                sharesBalance && metadata?.symbol
                  ? {
                      sharesBalance,
                      currency: metadata?.symbol,
                    }
                  : undefined
              }
              modifier={({ sharesBalance, currency }) =>
                `${formatNumber(sharesBalance, lng)} ${currency}`
              }
            />
          }
        />
      </div>
    </div>
  );
}
