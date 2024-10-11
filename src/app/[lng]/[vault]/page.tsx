import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { RouteHoc } from '@routes/hoc';
import { VaultHeader } from '@components/vault-form/header';
import { VaultStats } from '@components/vault-form/stats';
import { Form } from '@components/vault-form/form';

export { generateFallbackMetadata as generateMetadata } from '@routes/generate-fallback-metadata';

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
function VaultPage({ params }: RouteInfoToLayout<typeof Route>) {
  return (
    <>
      <VaultHeader lng={params.lng!} vaultAddress={params.vault} />
      <Form lng={params.lng!} vaultAddress={params.vault} />
      <VaultStats lng={params.lng!} vaultAddress={params.vault} />
    </>
  );
}

export default RouteHoc(Route)(VaultPage);
