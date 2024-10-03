'use client';

import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { Card, CardContent, CardTitle } from '@UI/card';
import { Language } from '@i18n/settings';
import { Currency, Maybe } from '@types';
import Link from 'next/link';
import { OrLoader } from '@components/loader/loader';
import { GlassCard } from '@components/glass-card';

export type VaultCardProps = {
  title: Maybe<string>;
  earnValue: Maybe<{ amount: string; currency: Currency }>;
  totalYield: Maybe<number>;
  address: string;
};

type CardProps = React.ComponentProps<typeof Card> & {
  data: VaultCardProps;
  locale: Language;
};

function NanoInfo({ value }: { value: React.ReactNode }) {
  return (
    <div className='custom-card-info'>
      <span className='custom-card-value'>{value}</span>
    </div>
  );
}

function LinkedInfo({ value }: { value: React.ReactNode }) {
  return (
    <div className='custom-list-el custom-card-info'>
      <span className='custom-card-link custom-card-value'>{value}</span>
    </div>
  );
}

export function VaultCard({ data, locale, className, ...props }: CardProps) {
  const { totalYield, earnValue, address, title } = data;

  return (
    <Link href={address} className='custom-wrapper'>
      <GlassCard className={cn(className)} {...props}>
        <CardContent className='custom-card-content'>
          <CardTitle className='custom-card-header'>
            {title?.replace(/(Parraton: |DeDust Pool: )/, '')}
          </CardTitle>
          <NanoInfo
            value={
              <OrLoader
                animation={false}
                value={earnValue}
                modifier={({ amount, currency }) =>
                  currency === Currency.USD
                    ? formatCurrency(amount, locale)
                    : `${formatNumber(amount, locale, false)} ${currency}`
                }
              />
            }
          />
          <LinkedInfo
            value={
              <OrLoader
                animation={false}
                value={totalYield}
                modifier={(x) => formatPercentage(x, locale)}
              />
            }
          />
        </CardContent>
      </GlassCard>
    </Link>
  );
}
