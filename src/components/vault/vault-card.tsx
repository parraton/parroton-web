'use client';

import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { Card, CardContent, CardTitle } from '@UI/card';
import { Language } from '@i18n/settings';
import { Maybe } from '@types';
import { useTranslation } from '@i18n/client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { OrLoader } from '@components/loader/loader';
import { GlassCard } from '@components/glass-card';

export type VaultCardProps = {
  title: Maybe<string>;
  balance: Maybe<string>;
  currency: Maybe<string>;
  deposited: Maybe<string>;
  apy: Maybe<string>;
  daily: Maybe<string>;
  extraApr: Maybe<string>;
  tvl: Maybe<string>;
  address: string;
};

type CardProps = React.ComponentProps<typeof Card> & { data: VaultCardProps; locale: Language };

function NanoInfo({ title, value }: { title: string; value: ReactNode }) {
  return (
    <div className='custom-card-info'>
      <span className='custom-card-title'>{title}</span>
      <span className='custom-card-value'>{value}</span>
    </div>
  );
}

function LinkedInfo({
  title,
  value,
  tooltip,
  tooltipTitle,
}: {
  title: ReactNode;
  value: ReactNode;
  tooltip?: ReactNode;
  tooltipTitle?: string;
}) {
  return (
    <div className='custom-list-el custom-card-info'>
      <div className={`custom-card-title `}>
        <div className={tooltip ? 'custom-list-header' : undefined}>
          {title}
          {tooltip && (
            <span className='custom-tooltip custom-tooltip-xs'>
              {tooltipTitle} {tooltip}
            </span>
          )}
        </div>
      </div>
      <div className={`custom-card-link custom-card-value`}>{value}</div>
    </div>
  );
}

export function VaultCard({ data, locale, className, ...props }: CardProps) {
  const { t } = useTranslation({
    ns: 'vault-card',
  });

  const totalRewardPercent =
    data.apy != null && data.extraApr != null
      ? Number(data.apy) + Number(data.extraApr)
      : undefined;

  const tooltipApy = `${t('apy')}: `;
  const tooltipExtraApr = `${t('extraApr')}: `;

  return (
    <Link href={data.address} className='custom-wrapper'>
      <GlassCard className={cn(className)} {...props}>
        <CardContent className='custom-card-content'>
          <CardTitle className='custom-card-header'>
            {data.title?.replace('Parraton: ', '')}
          </CardTitle>
          <NanoInfo
            title={t('balance')}
            value={<OrLoader value={data.balance} modifier={(x) => formatNumber(x, locale)} />}
          />
          <NanoInfo
            title={t('deposited')}
            value={<OrLoader value={data.deposited} modifier={(x) => formatNumber(x, locale)} />}
          />
          <LinkedInfo
            title={t('apy')}
            value={
              <OrLoader
                animation
                value={totalRewardPercent}
                modifier={(x) => formatPercentage(x, locale)}
              />
            }
            tooltip={
              totalRewardPercent ? (
                <div>
                  <div>
                    {tooltipApy}
                    <OrLoader
                      animation
                      value={data.apy}
                      modifier={(x) => formatPercentage(x, locale)}
                    />
                  </div>
                  <div>
                    {tooltipExtraApr}
                    <OrLoader
                      animation
                      value={data.extraApr}
                      modifier={(x) => formatPercentage(x, locale)}
                    />
                  </div>
                </div>
              ) : undefined
            }
          />
          <NanoInfo
            title={t('daily')}
            value={
              <OrLoader
                animation
                value={data.daily}
                modifier={(x) => formatPercentage(x, locale)}
              />
            }
          />
          <NanoInfo
            title={t('tvl')}
            value={
              <OrLoader animation value={data.tvl} modifier={(x) => formatCurrency(x, locale)} />
            }
          />
        </CardContent>
      </GlassCard>
    </Link>
  );
}
