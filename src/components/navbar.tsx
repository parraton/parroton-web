import { serverTranslation } from '@i18n';
import { cn } from '@lib/utils';
import { Home } from '@routes';
import { Settings } from '@components/settings';
import { Language } from '@i18n/settings';
import { ConnectWallet } from '@components/connect-wallet';

export async function Navbar({ lng }: { lng: Language }) {
  const { t } = await serverTranslation(lng, 'common');

  return (
    <nav className={cn('flex h-24 justify-between bg-lime-200')}>
      <div className={cn('container flex items-center justify-between')}>
        <Home.Link className={cn('flex items-center gap-2')}>
          <img src='/images/logo.png' alt='Home' width={24} height={24} />
          <span>{t('app_title')}</span>
        </Home.Link>

        <div className={cn('flex items-center gap-4')}>
          <ConnectWallet />
          <Settings lng={lng} />
        </div>
      </div>
    </nav>
  );
}
