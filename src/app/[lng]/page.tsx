import type { Metadata } from 'next';
import { Demo } from '@components/Demo';
import { serverTranslation } from '@i18n';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';

export async function generateMetadata({
  params,
}: RouteInfoToLayout<typeof Route>): Promise<Metadata> {
  const { lng } = params;

  const { t } = await serverTranslation(lng!, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <Demo />
    </main>
  );
}
