import { Button } from '@UI/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@UI/dialog';
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
        <Button variant='outline' className='settings-btn' />
      </DialogTrigger>
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
        <ReferralSection />
      </DialogContent>
    </Dialog>
  );
}
