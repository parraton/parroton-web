'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect } from 'react';
import { useStorage } from '@hooks/use-storage';
import { welcomeKey, welcomeValue } from '@config/guide.config';
import { Welcome } from '@routes';
import { useParams } from '@routes/hooks';
import { isMainnet } from '@lib/utils';

export function LayoutProviderHelper({ welcome, other }: { welcome: ReactNode; other: ReactNode }) {
  const pathname = usePathname();
  const { lng } = useParams(Welcome);
  const { getItem } = useStorage();

  const router = useRouter();

  const isWelcomePage = pathname.includes('welcome');

  useEffect(() => {
    (async () => {
      if (isWelcomePage) return;
      const passWelcomePage = await getItem(welcomeKey);
      if (isMainnet) {
        return;
      }

      if (passWelcomePage !== welcomeValue) {
        router.push(`/${lng}/welcome?redirectUrl=${pathname}`);
      }
    })();
  }, [isWelcomePage, lng, pathname, router, getItem]);

  return isWelcomePage ? welcome : other;
}
