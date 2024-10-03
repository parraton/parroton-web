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
  const sharesBalanceLoading = !sharesBalanceError && sharesBalance === undefined;

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
  <div className='custom-info-card'>
    <span className='custom-info-value'>{value}</span>
    <span
      className={cn(
        {
          ['custom-list-header']: tooltip,
        },
        'custom-info-title',
      )}
    >
      {title}

      {tooltip && (
        <span className='custom-tooltip'>
          {tooltipTitle} {tooltip}
        </span>
      )}
    </span>
  </div>
);

export function VaultInfo() {
  const { metadata, poolNumbers, kpis, lng, vaultLoading, pendingReinvestLoading } = useVaultInfo();
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

  return (
    <>
      <div className='custom-info-header'>
        <h1 className='custom-info-heading'>
          <OrLoader
            animation={vaultLoading}
            value={
              metadata?.name && (
                <>
                  <span>{metadata?.name.split(':')[1]}</span>
                </>
              )
            }
          />
        </h1>
        <KpiDialog values={kpis} lng={lng} />
      </div>
      <div className='custom-info-list glass-card p-6'>
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
          title={t('apy')}
          value={
            <OrLoader
              animation={vaultLoading}
              value={totalRewardPercent}
              modifier={(x) => formatPercentage(x, lng)}
            />
          }
        />
      </div>
    </>
  );
}
