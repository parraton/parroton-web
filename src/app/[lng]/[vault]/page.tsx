import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { RouteHoc } from '@routes/hoc';
import { cn } from '@lib/utils';
import { Form } from '@components/vault-form/form';
import { VaultInfo } from '@components/vault-form/vault.info';

function VaultPage({ params }: RouteInfoToLayout<typeof Route>) {
  return (
    <div className={'flex flex-col gap-8'}>
      <VaultInfo />
      <div className={cn('custom-wrapper custom-form')}>
        <Form lng={params.lng!} />
      </div>
    </div>
  );
}

export default RouteHoc(Route)(VaultPage);
