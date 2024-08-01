'use client';

import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { usePoolNumbers } from '@hooks/use-pool-numbers';
import { OrLoader } from '@components/loader/loader';
import { ReactNode } from 'react';
import { useTranslation } from '@i18n/client';
import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { usePoolMetadata } from '@hooks/use-pool-metadata';
import { KpiDialog } from '@components/kpi/kpi-dialog';
import { GlassCard } from '@components/glass-card';

const useVaultInfo = () => {
  const { vault, lng } = useParams(VaultPage);
  const { balance: sharesBalance } = useSharesBalance(vault);
  const { metadata } = usePoolMetadata(vault);
  const { poolNumbers } = usePoolNumbers(vault);

  return { sharesBalance: sharesBalance?.lpBalance, metadata, poolNumbers, lng };
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
  const { sharesBalance, metadata, poolNumbers, lng } = useVaultInfo();
  const { t } = useTranslation({ ns: 'vault-card' });

  const totalRewardPercent =
    poolNumbers?.apy != null && poolNumbers?.extraApr != null
      ? Number(poolNumbers.apy) + Number(poolNumbers.extraApr)
      : undefined;

  const tooltipApy = `${t('apy')}: `;
  const tooltipExtraApr = `${t('extraApr')}: `;

  return (
    <div className={'g flex flex-col gap-4'}>
      <h1 className={'scroll-m-20 text-4xl font-medium tracking-tight'}>
        <OrLoader animation value={metadata?.name} />
      </h1>
      <KpiDialog />
      <div className='custom-list'>
        <NanoInfoPlate
          title={t('tvl')}
          value={
            <OrLoader
              animation
              value={poolNumbers?.tvlInUsd}
              modifier={(x) => formatCurrency(x, lng)}
            />
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
          tooltip={
            totalRewardPercent ? (
              <div>
                <div>
                  {tooltipApy}
                  <OrLoader
                    animation
                    value={poolNumbers!.apy}
                    modifier={(x) => formatPercentage(x, lng)}
                  />
                </div>
                <div>
                  {tooltipExtraApr}
                  <OrLoader
                    animation
                    value={poolNumbers!.extraApr}
                    modifier={(x) => formatPercentage(x, lng)}
                  />
                </div>
              </div>
            ) : undefined
          }
        />
        <NanoInfoPlate
          title={t('daily')}
          value={
            <OrLoader
              animation
              value={poolNumbers?.daily}
              modifier={(x) => formatPercentage(x, lng)}
            />
          }
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
