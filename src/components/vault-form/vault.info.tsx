'use client';

import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { useVaultMetadata } from '@hooks/use-vault-metadata';
import { usePoolNumbers } from '@hooks/use-pool-numbers';
import { OrLoader } from '@components/loader/loader';
import { ReactNode } from 'react';
import { useTranslation } from '@i18n/client';
import { formatCurrency, formatNumber, formatPercentage } from '@lib/utils';

const useVaultInfo = () => {
  const { vault, lng } = useParams(VaultPage);
  const { balance: sharesBalance } = useSharesBalance(vault);
  const { metadata } = useVaultMetadata(vault);
  const { poolNumbers } = usePoolNumbers(vault);

  return { sharesBalance, metadata, poolNumbers, lng };
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
  <div className={'custom-list-el flex flex-col items-center gap-2 bg-gradient-to-b p-3'}>
    <div className={`${tooltip && 'custom-list-header'} text-l z-20 font-medium`}>
      {title}
      {tooltip && (
        <span className='custom-tooltip'>
          {tooltipTitle} {tooltip}
        </span>
      )}
    </div>
    <div className={'z-20 text-sm font-bold'}>{value}</div>
  </div>
);

export function VaultInfo() {
  const { sharesBalance, metadata, poolNumbers, lng } = useVaultInfo();
  const { t } = useTranslation({ ns: 'vault-card' });

  return (
    <div className={'g flex flex-col gap-4'}>
      <h1 className={'scroll-m-20 text-4xl font-medium tracking-tight'}>
        {metadata?.name ?? '~~~~'}
      </h1>
      <div className='custom-list'>
        <div className='custom-list-item custom-card rounded-lg border text-card-foreground shadow-sm'>
          <NanoInfoPlate
            title={t('tvl')}
            value={
              <OrLoader value={poolNumbers?.tvlInUsd} modifier={(x) => formatCurrency(x, lng)} />
            }
          />
          <NanoInfoPlate
            title={t('apy')}
            value={<OrLoader value={poolNumbers?.apy} modifier={(x) => formatPercentage(x, lng)} />}
            tooltip={
              <OrLoader value={poolNumbers?.daily} modifier={(x) => formatPercentage(x, lng)} />
            }
            tooltipTitle={`${t('extraApr')}: `}
          />
        </div>
        <div className='custom-list-item custom-card rounded-lg border text-card-foreground shadow-sm'>
          <NanoInfoPlate
            title={t('daily')}
            value={
              <OrLoader value={poolNumbers?.daily} modifier={(x) => formatPercentage(x, lng)} />
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
    </div>
  );
}
