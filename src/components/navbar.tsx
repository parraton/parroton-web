import { serverTranslation } from '@i18n';
import { cn } from '@lib/utils';
import { Home } from '@routes';
import { Settings } from '@components/settings';
import { Language } from '@i18n/settings';
import { ConnectWallet } from '@components/connect-wallet';
import Image from 'next/image';

import Logo from '../images/logo.svg';
import { guideLink } from '@config/guide.config';
import Link from 'next/link';
import { QuestionMarkCircledIcon } from '@radix-ui/react-icons';

export async function Navbar({ lng }: { lng: Language }) {
  const { t } = await serverTranslation(lng, 'common');

  return (
    <div className={cn('custom-header')}>
      <Home.Link className={cn('flex items-center gap-2')}>
        <Image src={Logo} alt='Home' width={24} height={24} />
        <span className='custom-header-title'>{t('app_title')}</span>
      </Home.Link>

      <div className={cn('flex items-center gap-4')}>
        <ConnectWallet />
        <Link href={guideLink} target='_blank'>
          <QuestionMarkCircledIcon color='#0098ea' width={32} height={32} />
        </Link>
        <Settings lng={lng} />
      </div>
    </div>
  );
}
