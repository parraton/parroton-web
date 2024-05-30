import type { Metadata } from 'next';
import { serverTranslation } from '@i18n';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { mocks, VaultCard } from '@components/vault-card';

export async function generateMetadata({
  params,
}: RouteInfoToLayout<typeof Route>): Promise<Metadata> {
  const { t } = await serverTranslation(params.lng!, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}

export default function Home({ params }: RouteInfoToLayout<typeof Route>) {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      {mocks.map((data, index) => (
        <VaultCard key={index} data={data} locale={params.lng!} />
      ))}
    </main>
  );
}
