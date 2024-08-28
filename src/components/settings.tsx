import { SlidersHorizontal } from 'lucide-react';

import { Button } from '@UI/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@UI/dialog';
import { ModeToggle } from '@components/mode-toggle';
import { LanguageToggle } from '@components/toggle-language';
import { cn } from '@lib/utils';
import { serverTranslation } from '@i18n';
import { Language } from '@i18n/settings';
import { ReferralSection } from '@components/referral-section';

export async function Settings({ lng }: { lng: Language }) {
  const { t } = await serverTranslation(lng, 'settings');

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='border-[#19A7E7] bg-accent px-3 hover:scale-95'
          // text-accent-foreground hover:text-accent'
        >
          <SlidersHorizontal color='#19A7E7' className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='custom-dialog sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>{t('dialog_title')}</DialogTitle>
          <DialogDescription>{t('dialog_description')}</DialogDescription>
        </DialogHeader>
        <div className='custom-toggler-list'>
          <div className={cn('custom-toggler')}>
            <span className={cn('text-xs')}>{t('mode_title')}</span>
            <ModeToggle />
          </div>
          <div className={cn('custom-toggler')}>
            <span className={cn('text-xs')}>{t('language_title')}</span>
            <LanguageToggle />
          </div>
        </div>

        <ReferralSection />
      </DialogContent>
    </Dialog>
  );
}
