import { RouteInfoToLayout } from '@routes/makeRoute';
import { Route } from './page.info';
import { RouteHoc } from '@routes/hoc';
import { cn } from '@lib/utils';
import { Form } from '@components/vault-form/form';

function VaultPage({ params }: RouteInfoToLayout<typeof Route>) {
  return (
    <div className={cn('grid h-max grid-cols-2 place-items-center items-center self-start')}>
      <Form lng={params.lng!} />
    </div>
  );
}

export default RouteHoc(Route)(VaultPage);
