'use client';

import { cn } from '@lib/utils';
import { Home } from '@routes';
import { Settings } from '@components/settings';
import { Language } from '@i18n/settings';
import { ConnectWallet } from '@components/connect-wallet';
import Image from 'next/image';

import Logo from '@images/logo.svg';
import { PreferredCurrencyButton } from '@preferred-currency-button';
import { useTranslation } from '@i18n/client';
import { usePathname } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
import { PiggyBankIcon } from '../icons/piggy-bank';
import { StarIcon } from '../icons/star';
import { LinkButton } from './link-button';
import { SettingsButton } from './settings-button';

export function Navbar({ lng }: { lng: Language }) {
  const [settingsAreOpen, setSettingsAreOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation({ lng, ns: 'common' });

  const openSettingsSection = useCallback(() => setSettingsAreOpen(true), []);

  const activeButtonSlug = useMemo(() => {
    if (settingsAreOpen) return 'settings';

    if (pathname.includes('/rewards')) return 'rewards';

    return 'stake';
  }, [pathname, settingsAreOpen]);

  return (
    <div className={cn('custom-header')}>
      <Home.Link className={cn('flex items-center gap-2')}>
        <Image src={Logo} alt='Home' width={36} height={36} />
      </Home.Link>

      <ul className='custom-nav-list'>
        <LinkButton
          href={`/${lng}/rewards`}
          isActive={activeButtonSlug === 'rewards'}
          Icon={StarIcon}
        >
          {t('earn')}
        </LinkButton>
        <LinkButton href='/' isActive={activeButtonSlug === 'stake'} Icon={PiggyBankIcon}>
          {t('stake')}
        </LinkButton>

        <SettingsButton
          className='md:hidden'
          isActive={activeButtonSlug === 'settings'}
          onClick={openSettingsSection}
        />
      </ul>

      <div className={cn('flex items-center justify-end gap-4')}>
        <PreferredCurrencyButton />
        <ConnectWallet />
        <SettingsButton
          className='hidden md:block'
          isActive={activeButtonSlug === 'settings'}
          onClick={openSettingsSection}
        />
      </div>

      <Settings lng={lng} open={settingsAreOpen} onOpenChange={setSettingsAreOpen} />
    </div>
  );
}
