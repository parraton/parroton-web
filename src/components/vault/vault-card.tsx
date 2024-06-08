'use client';

import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { Card, CardContent, CardTitle } from '@UI/card';
import { Language } from '@i18n/settings';
import { Maybe } from '@types';
import { useTranslation } from '@i18n/client';
import Link from '../../../node_modules/next/link';

export type VaultCardProps = {
  title: string;
  balance: Maybe<string>;
  currency: string;
  deposited: Maybe<string>;
  apy: Maybe<string>;
  daily: Maybe<string>;
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

function LinkedInfo({ title, value }: { title: string; value: string }) {
  return (
    <div className='custom-card-info'>
      <span className='custom-card-title'>{title}</span>
      <span className='custom-card-link' title={value}>
        {value}
      </span>
    </div>
  );
}

export function VaultCard({ data, locale, className, ...props }: CardProps) {
  const { t } = useTranslation({
    ns: 'vault-card',
  });

  return (
    <Link href={data.address}>
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
          <LinkedInfo title={t('apy')} value={data.apy ? formatPercentage(data.apy) : '~~~~'} />
          <NanoInfo title={t('daily')} value={data.daily ? formatPercentage(data.daily) : '~~~~'} />
          <NanoInfo title={t('tvl')} value={data.tvl ? formatCurrency(data.tvl, locale) : '~~~~'} />
        </CardContent>
      </Card>
    </Link>
  );
}
