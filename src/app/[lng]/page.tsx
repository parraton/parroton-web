import type { Metadata } from 'next';
import { serverTranslation } from '@i18n';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { VaultsList } from '@components/vault/vaults-list';

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
  return <VaultsList lng={params.lng!} />;
}
