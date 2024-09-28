'use client';

import { cn, formatNumber, formatPercentage } from '@lib/utils';
import { Card, CardContent, CardTitle } from '@UI/card';
import { Language } from '@i18n/settings';
import { Maybe } from '@types';
import Link from 'next/link';
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
  isLpError: boolean;
  isSharesError: boolean;
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
  const totalRewardPercent =
    data.apy && data.extraApr ? Number(data.apy) + Number(data.extraApr) : undefined;

  return (
    <Link href={data.address} className='custom-wrapper'>
      <GlassCard className={cn(className)} {...props}>
        <CardContent className='custom-card-content'>
          <CardTitle className='custom-card-header'>
            {data.title?.replace(/(Parraton: |DeDust Pool: )/, '')}
          </CardTitle>
          <NanoInfo
            value={
              <OrLoader
                animation={data.deposited !== null && !data.isSharesError}
                value={data.deposited}
                modifier={(x) => formatNumber(x, locale)}
              />
            }
          />
          <LinkedInfo
            value={
              <OrLoader
                animation
                value={totalRewardPercent}
                modifier={(x) => formatPercentage(x, locale)}
              />
            }
          />
        </CardContent>
      </GlassCard>
    </Link>
  );
}
