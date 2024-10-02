'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@UI/dialog';
import { ModeToggle } from '@components/mode-toggle';
import { LanguageToggle } from '@components/toggle-language';
import { cn } from '@lib/utils';
import { Language } from '@i18n/settings';
import { useTranslation } from '@i18n/client';

interface Props {
  lng: Language;
  open: boolean;
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void;
}

export function Settings({ lng, open, onOpenChange }: Props) {
  const { t } = useTranslation({ lng, ns: 'settings' });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`custom-dialog custom-modal-settings sm:max-w-md`}>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{t('dialog_title')}</DialogTitle>
        </DialogHeader>
        <div className='custom-toggler-list'>
          <div className={cn('custom-toggler')}>
            <span className={cn('text-[1rem] font-semibold')}>{t('mode_title')}</span>
            <ModeToggle />
          </div>
          <div className={cn('custom-toggler')}>
            <span className={cn('text-[1rem] font-semibold')}>{t('language_title')}</span>
            <LanguageToggle />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
