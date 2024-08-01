import type { Metadata } from 'next';
import { serverTranslation } from '@i18n';
import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { Vault } from '@components/vault/vault';
import { addresses } from '@config/contracts-config';
import { redirect } from 'next/navigation';
import { RedirectType } from 'next/dist/client/components/redirect';

export async function generateMetadata({
  params,
}: RouteInfoToLayout<typeof Route>): Promise<Metadata> {
  const { t } = await serverTranslation(params.lng!, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}

//need to remove typescript unintentional warning
const isRedirectNeeded = (vaultsQuantity: number) => vaultsQuantity === 1;

export default function Home({ params }: RouteInfoToLayout<typeof Route>) {
  if (isRedirectNeeded(addresses.vaults.length)) {
    redirect(`/${params.lng}/${addresses.vaults[0].vault.toString()}`, RedirectType.replace);
  }

  return (
    <>
      {addresses.vaults.map(({ vault }, index) => (
        <Vault key={index} lng={params.lng!} address={vault.toString()} />
      ))}
    </>
  );
}
