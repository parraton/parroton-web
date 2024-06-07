import type { Metadata } from 'next';
import { serverTranslation } from '@i18n';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { Vault } from '@components/vault/vault';
import { addresses } from '@config/contracts-config';

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
    <div className={'grid grid-cols-2 items-center '}>
      {addresses.vaults.map(({ vault }, index) => (
        <Vault key={index} lng={params.lng!} address={vault.toString()} />
      ))}
    </div>
  );
}
