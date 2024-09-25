import { Button } from '@UI/button';
import { Dialog, DialogContent } from '@UI/dialog';
import { useCopyReferralLink } from '@hooks/use-copy-referral-link';
import { useTranslation } from '@i18n/client';
import React, { useCallback } from 'react';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReferralModal = ({ isOpen, onClose }: ReferralModalProps) => {
  const { t } = useTranslation({ ns: 'rewards' });
  const handleOpenChange = useCallback((newValue: boolean) => !newValue && onClose(), [onClose]);
  const { link: webAppLink, copyLink: copyWebAppLink } = useCopyReferralLink(false);
  const { link: miniAppLink, copyLink: copyMiniAppLink } = useCopyReferralLink(true);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={`custom-dialog glass-card modal-card sm:max-w-md`}>
        {miniAppLink ? (
          <>
            <p>{t('referral_mini_app')}</p>
            <textarea
              rows={2}
              readOnly
              className='w-full resize-none rounded-lg'
              value={miniAppLink}
            />
            <Button onClick={copyMiniAppLink}>{t('copy_referral')}</Button>
          </>
        ) : null}
        {webAppLink ? (
          <>
            <p>{t('referral_title')}</p>
            <textarea
              rows={2}
              readOnly
              className='w-full resize-none rounded-lg'
              value={webAppLink}
            />
            <Button onClick={copyWebAppLink}>{t('copy_referral')}</Button>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
