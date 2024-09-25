'use client';

import { Button } from '@UI/button';
import { ClipboardCheck, Files } from 'lucide-react';
import { useTranslation } from '@i18n/client';
import { useState } from 'react';
import { cn } from '@lib/utils';
import { useCopyReferralLink } from '@hooks/use-copy-referral-link';

interface CopyButtonProps {
  miniApp?: boolean;
}

export function CopyButton({ miniApp }: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { t } = useTranslation({ ns: 'settings' });

  const onAfterCopy = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const { copyLink } = useCopyReferralLink(miniApp ?? false, onAfterCopy);

  return (
    <Button
      onClick={copyLink}
      variant='outline'
      size='sm'
      className={cn('copy-button flex h-7 w-fit transform gap-1 bg-[#19A7E7] px-3', {
        'animate-pulse bg-[#5ACD30] hover:bg-[none]': isCopied,
      })}
    >
      <span className='text-xs'>{t('copy_referral')}</span>
      {isCopied ? (
        <ClipboardCheck color='#fff' className='size-4' />
      ) : (
        <Files color='#fff' className='size-4' />
      )}
    </Button>
  );
}
