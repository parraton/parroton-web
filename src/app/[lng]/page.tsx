import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { VaultsList } from '@components/vault/vaults-list';

export { generateFallbackMetadata as generateMetadata } from '@routes/generate-fallback-metadata';

export default function Home({ params }: RouteInfoToLayout<typeof Route>) {
  return <VaultsList lng={params.lng!} />;
}
