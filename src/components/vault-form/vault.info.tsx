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
import { Carousel } from '@components/carousel/carousel';

const useVaultInfo = () => {
  const { vault, lng } = useParams(VaultPage);
  const { balance: sharesBalance } = useSharesBalance(vault);
  const { metadata } = useVaultMetadata(vault);
  const { poolNumbers } = usePoolNumbers(vault);

  return { sharesBalance, metadata, poolNumbers, lng };
};

const NanoInfoPlate = ({ title, value }: { title: ReactNode; value: ReactNode }) => (
  <div className={'flex flex-col items-center gap-2 bg-gradient-to-b p-3'}>
    <div className={'text-l z-20 font-medium'}>{title}</div>
    <div className={'z-20 text-sm font-bold'}>{value}</div>
  </div>
);

export function VaultInfo() {
  const { sharesBalance, metadata, poolNumbers, lng } = useVaultInfo();
  const { t } = useTranslation({ ns: 'vault-card' });

  return (
    <div className={'g flex flex-col gap-6'}>
      <h1 className={'scroll-m-20 text-4xl font-medium tracking-tight lg:text-5xl'}>
        {metadata?.name ?? '~~~~'}
      </h1>
      <Carousel slidesToShow={4}>
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
        <NanoInfoPlate
          title={t('apy')}
          value={<OrLoader value={poolNumbers?.apy} modifier={(x) => formatPercentage(x, lng)} />}
        />
        <NanoInfoPlate
          title={t('daily')}
          value={<OrLoader value={poolNumbers?.daily} modifier={(x) => formatPercentage(x, lng)} />}
        />
        <NanoInfoPlate
          title={t('extraApr')}
          value={
            <OrLoader value={poolNumbers?.extraApr} modifier={(x) => formatPercentage(x, lng)} />
          }
        />
        <NanoInfoPlate
          title={t('tvl')}
          value={
            <OrLoader value={poolNumbers?.tvlInUsd} modifier={(x) => formatCurrency(x, lng)} />
          }
        />
      </Carousel>
    </div>
  );
}