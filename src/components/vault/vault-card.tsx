'use client';

import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { Card, CardContent, CardTitle } from '@UI/card';
import { Language } from '@i18n/settings';
import { Maybe } from '@types';
import { useTranslation } from '@i18n/client';
import Link from 'next/link';
import { ReactNode } from 'react';
import { OrLoader } from '@components/loader/loader';

export type VaultCardProps = {
  title: string;
  balance: Maybe<string>;
  currency: string;
  deposited: Maybe<string>;
  apy: Maybe<string>;
  daily: Maybe<string>;
  extraApr: Maybe<string>;
  tvl: Maybe<string>;
  address: string;
};

type CardProps = React.ComponentProps<typeof Card> & { data: VaultCardProps; locale: Language };

function NanoInfo({ title, value }: { title: string; value: string }) {
  return (
    <div className='custom-card-info'>
      <span className='custom-card-title'>{title}</span>
      <span className='custom-card-value' title={value}>
        {value}
      </span>
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
      <div className={`custom-card-title ${tooltip && 'custom-list-header'}`}>
        {title}
        {tooltip && (
          <span className='custom-tooltip'>
            {tooltipTitle} {tooltip}
          </span>
        )}
      </div>
      <div className={` custom-card-link`}>{value}</div>
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
      <Card className={cn('custom-card', className)} {...props}>
        <CardContent className='custom-card-content'>
          <CardTitle className='custom-card-header'>{data.title}</CardTitle>
          <NanoInfo
            title={t('balance')}
            value={data.balance ? `${formatNumber(data.balance, locale)} ${data.currency}` : '~~~~'}
          />
          <NanoInfo
            title={t('deposited')}
            value={
              data.deposited ? `${formatNumber(data.deposited, locale)} ${data.currency}` : '~~~~'
            }
          />
          <LinkedInfo
            title={t('apy')}
            value={
              <OrLoader value={totalRewardPercent} modifier={(x) => formatPercentage(x, locale)} />
            }
            tooltip={
              totalRewardPercent ? (
                <div>
                  <div>
                    {tooltipApy}
                    <OrLoader value={data.apy} modifier={(x) => formatPercentage(x, locale)} />
                  </div>
                  <div>
                    {tooltipExtraApr}
                    <OrLoader value={data.extraApr} modifier={(x) => formatPercentage(x, locale)} />
                  </div>
                </div>
              ) : undefined
            }
          />
          <NanoInfo title={t('daily')} value={data.daily ? formatPercentage(data.daily) : '~~~~'} />
          <NanoInfo title={t('tvl')} value={data.tvl ? formatCurrency(data.tvl, locale) : '~~~~'} />
        </CardContent>
      </Card>
    </Link>
  );
}
