import { serverTranslation } from '@i18n';
import { cn } from '@lib/utils';
import { ModeToggle } from './mode-toggle';
import { Home } from '@routes';

export async function Navbar({ lng }: { lng: string }) {
  const { t } = await serverTranslation(lng, 'common');

  return (
    <nav className={cn('m-8 flex justify-between')}>
      <div className={cn('grid place-content-center')}>
        <Home.Link>{t('app_title')}</Home.Link>
      </div>

      <ModeToggle />
    </nav>
  );
}
