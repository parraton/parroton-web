'use client';

import { cn, formatCurrency, formatNumber, formatPercentage } from '@lib/utils';
import { Button } from '@UI/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@UI/card';
import { Language } from '@i18n/settings';
import { VaultPage } from '@routes';
import { Maybe } from '@types';
import { useTranslation } from '@i18n/client';

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
    <div className='flex justify-between'>
      <span className='text-xs text-gray-500'>{title}</span>
      <span>{value}</span>
    </div>
  );
}

export function VaultCard({ data, locale, className, ...props }: CardProps) {
  const { t } = useTranslation({
    ns: 'vault-card',
  });

  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription className={cn('flex gap-2')}></CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
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
        <NanoInfo title={t('apy')} value={data.apy ? formatPercentage(data.apy) : '~~~~'} />
        <NanoInfo title={t('daily')} value={data.daily ? formatPercentage(data.daily) : '~~~~'} />
        <NanoInfo title={t('tvl')} value={data.tvl ? formatCurrency(data.tvl, locale) : '~~~~'} />
      </CardContent>
      <CardFooter>
        <Button className='w-full' asChild>
          <VaultPage.Link vault={data.address} lng={locale}>
            {t('manage')}
          </VaultPage.Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
