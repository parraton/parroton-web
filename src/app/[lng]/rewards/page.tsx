import type { Metadata } from 'next';
import { serverTranslation } from '@i18n';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { RewardsBody } from './rewards-body';

export async function generateMetadata({
  params,
}: RouteInfoToLayout<typeof Route>): Promise<Metadata> {
  const { t } = await serverTranslation(params.lng!, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}

export default function Rewards() {
  return (
    <div className='custom-wrapper flex w-full justify-center'>
      <div className='flex max-w-md flex-col gap-2 md:gap-4'>
        <RewardsBody />
      </div>
    </div>
  );
}
