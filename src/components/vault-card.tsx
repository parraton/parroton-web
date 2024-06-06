import { cn, formatCurrency, formatPercentage } from '@lib/utils';
import { Button } from '@components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import { Language } from '@i18n/settings';
import { serverTranslation } from '@i18n';
import { VaultPage } from '@routes';
import { addresses } from '@config/contracts-config';

export type VaultCardProps = {
  title: string;
  tags: string[];
  balance: string;
  currency: string;
  deposited: string;
  apy: string;
  daily: string;
  tvl: string;
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

export async function VaultCard({ data, locale, className, ...props }: CardProps) {
  const { t } = await serverTranslation(locale, 'vault-card');

  return (
    <Card className={cn('w-[380px]', className)} {...props}>
      <CardHeader>
        <CardTitle>{data.title}</CardTitle>
        <CardDescription className={cn('flex gap-2')}>
          {data.tags.map((tag) => (
            <span key={tag} className='text-xs text-gray-500'>
              {tag}
            </span>
          ))}
        </CardDescription>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <NanoInfo
          title={t('balance')}
          value={formatCurrency(data.balance, locale, data.currency)}
        />
        <NanoInfo
          title={t('deposited')}
          value={formatCurrency(data.deposited, locale, data.currency)}
        />
        <NanoInfo title={t('apy')} value={formatPercentage(data.apy)} />
        <NanoInfo title={t('daily')} value={formatPercentage(data.daily)} />
        <NanoInfo title={t('tvl')} value={formatCurrency(data.tvl, locale)} />
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
