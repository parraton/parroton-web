'use client';

import { useTranslation } from '@i18n/client';
import { Button } from '@UI/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSearchParams } from '@routes/hooks';
import { Welcome } from '@routes';
import { useStorage } from '@hooks/use-storage';
import { guideLink, welcomeKey, welcomeValue } from '@config/guide.config';

export function WelcomeButtons() {
  const { t } = useTranslation({ ns: 'welcome' });
  const { setItem } = useStorage();
  const router = useRouter();
  const { redirectUrl } = useSearchParams(Welcome);

  const onClick = async () => {
    await setItem(welcomeKey, welcomeValue);
    const url = redirectUrl || '/';
    router.push(url);
  };

  return (
    <div className='flex flex-col gap-3'>
      <Button className='rounded-full bg-[#0098ea]' asChild onClick={onClick}>
        <Link href={guideLink} target='_blank'>
          {t('watch')}
        </Link>
      </Button>
      <Button
        style={{
          boxShadow: '0 0 2px 2px #0098ea inset',
        }}
        className='rounded-full bg-transparent text-[#0098ea]'
        onClick={onClick}
      >
        {t('skip')}
      </Button>
    </div>
  );
}
