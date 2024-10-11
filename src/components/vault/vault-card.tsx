'use client';

import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { Card, CardContent } from '@UI/card';
import { Language } from '@i18n/settings';
import { Currency, Maybe } from '@types';
import Link from 'next/link';
import { OrLoader } from '@components/loader/loader';
import { GlassCard } from '@components/glass-card';
import { ChevronRightIcon } from 'lucide-react';
import { DedustIcon } from '@components/icons/dedust';

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
    <div className='flex items-center gap-1'>
      <span className='custom-card-value'>{value}</span>
    </div>
  );
}

function LinkedInfo({ value }: { value: React.ReactNode }) {
  return (
    <div className='flex items-center justify-end gap-1'>
      <span className='custom-card-value text-custom-button'>{value}</span>
      <ChevronRightIcon size={16} className='text-[#8b9dad]' />
    </div>
  );
}

export function VaultCard({ data, locale, className, ...props }: CardProps) {
  const { totalYield, earnValue, address, title } = data;

  return (
    <Link href={address} className='custom-wrapper'>
      <GlassCard className={cn(className)} {...props}>
        <CardContent className='custom-card-content text-sm font-semibold'>
          <div className='flex items-center gap-2'>
            {title?.includes('DeDust') ? (
              <DedustIcon className='size-4' />
            ) : (
              <div className='size-4' />
            )}
            {title?.replace(/(Parraton: |DeDust Pool: )/, '')}
          </div>
          <NanoInfo
            value={
              <OrLoader
                animation={false}
                value={earnValue}
                modifier={({ amount, currency }) =>
                  currency === Currency.USD
                    ? formatCurrency(amount, locale)
                    : `${formatNumber(amount, locale, false)} TON`
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
