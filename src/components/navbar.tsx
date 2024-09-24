/* eslint-disable react/jsx-no-literals */
import { cn } from '@lib/utils';
import { Home } from '@routes';
import { Settings } from '@components/settings';
import { Language } from '@i18n/settings';
import { ConnectWallet } from '@components/connect-wallet';
import Image from 'next/image';

import Logo from '../images/logo.svg';
import Link from 'next/link';

export async function Navbar({ lng }: { lng: Language }) {
  // const { t } = await serverTranslation(lng, 'common');

  return (
    <div className={cn('custom-header')}>
      <Home.Link className={cn('flex items-center gap-2')}>
        <Image src={Logo} alt='Home' width={36} height={36} />
        {/*<span className='custom-header-title'>{t('app_title')}</span>*/}
      </Home.Link>

      <ul className='custom-nav-list'>
        <Link href={''}>
          <i className='custom-nav-icon icon-stake' />
          <span className='custom-nav-text'>Stake</span>
        </Link>
        <Link href={''}>
          <i className='custom-nav-icon icon-earn' />
          <span className='custom-nav-text'>Earn</span>
        </Link>
        <div className='custom-nav-settings'>
          <Settings lng={lng} />
        </div>
      </ul>

      <div className={cn('custom-settings-header flex items-center justify-end gap-4')}>
        <ConnectWallet />
        <Settings lng={lng} />
      </div>
    </div>
  );
}
