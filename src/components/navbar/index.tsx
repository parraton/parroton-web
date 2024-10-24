'use client';

import { Home } from '@routes';
import { Language } from '@i18n/settings';
import { ConnectWallet } from '@components/connect-wallet';
import Image from 'next/image';

import Logo from '@images/logo.svg';
import { PreferredCurrencyButton } from '@preferred-currency-button';
import { useTranslation } from '@i18n/client';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { PiggyBankIcon } from '../icons/piggy-bank';
import { StarIcon } from '../icons/star';
import { LinkButton } from './link-button';
import { SettingsIcon } from '@components/icons/settings';
import { useTonAddress } from '@tonconnect/ui-react';
import { useTypedStorageItem } from '@hooks/use-typed-storage-item';
import { isStringArray } from '@lib/utils';
import { QuestsApi } from '@core/quests-api';

const REPORTED_ADDRESSES_STORAGE_KEY = 'reported-addresses';
const REPORTED_ADDRESSES_DEFAULT_VALUE: string[] = [];
const dummyQuestsApi = new QuestsApi('');

export function Navbar({ lng }: { lng: Language }) {
  const pathname = usePathname();
  const { t } = useTranslation({ lng, ns: 'common' });
  const tonAddress = useTonAddress();
  const { value: reportedAddresses, setValue: setReportedAddresses } = useTypedStorageItem<
    string[]
  >(REPORTED_ADDRESSES_STORAGE_KEY, REPORTED_ADDRESSES_DEFAULT_VALUE, isStringArray);

  useEffect(() => {
    if (reportedAddresses && !reportedAddresses.includes(tonAddress) && tonAddress) {
      dummyQuestsApi
        .reportWalletConnected(tonAddress)
        .then(() => setReportedAddresses([...reportedAddresses, tonAddress]))
        .catch(console.error);
    }
  }, [reportedAddresses, setReportedAddresses, tonAddress]);

  const activeButtonSlug = useMemo(() => {
    if (pathname.includes('/settings')) return 'settings';

    if (pathname.includes('/rewards')) return 'rewards';

    return 'deposit';
  }, [pathname]);

  return (
    <div className='custom-header'>
      <Home.Link className='flex items-center gap-2'>
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
        <LinkButton href='/' isActive={activeButtonSlug === 'deposit'} Icon={PiggyBankIcon}>
          {t('deposit')}
        </LinkButton>
        <LinkButton
          href={`/${lng}/settings`}
          isActive={activeButtonSlug === 'settings'}
          Icon={SettingsIcon}
        >
          {t('settings')}
        </LinkButton>
      </ul>

      <div className='flex items-center justify-end gap-4'>
        <PreferredCurrencyButton />
        <ConnectWallet />
      </div>
    </div>
  );
}
