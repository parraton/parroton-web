import {RouteInfoToLayout} from '@routes/makeRoute';
import {Route} from './page.info';
import {RouteHoc} from '@routes/hoc';
import {cn} from '@lib/utils';
import {Form} from '@components/vault-form/form';

function VaultPage({params, searchParams}: RouteInfoToLayout<typeof Route>) {

  return (
    <div className={cn('grid h-max place-items-center')}>
      <Form lng={params.lng!}/>
    </div>
  );
}

export default RouteHoc(Route)(VaultPage);
