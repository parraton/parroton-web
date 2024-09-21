import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { RouteHoc } from '@routes/hoc';
import { cn } from '@lib/utils';
import { Form } from '@components/vault-form/form';
import { VaultInfo } from '@components/vault-form/vault.info';
import { serverTranslation } from '@i18n';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: RouteInfoToLayout<typeof Route>): Promise<Metadata> {
  const { t } = await serverTranslation(params.lng!, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}

function VaultPage({ params }: RouteInfoToLayout<typeof Route>) {
  return (
    <div className={'flex flex-col gap-8'}>
      <VaultInfo />
      <div className={cn('custom-form')}>
        <Form lng={params.lng!} vaultAddress={params.vault} />
      </div>
    </div>
  );
}

export default RouteHoc(Route)(VaultPage);
