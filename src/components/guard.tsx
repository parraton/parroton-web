'use client';

import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@UI/dialog';
import { useEffect, useState } from 'react';
import { useTranslation } from '@i18n/client';
import { Trans } from 'react-i18next';
import { ButtonV2 } from '@UI/button-v2';

export function Guard() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!localStorage.getItem('terms'));
  }, []);

  const { t } = useTranslation({ ns: 'terms' });
  const close = () => {
    setOpen(false);
    localStorage.setItem('terms', `read`);
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent>
        <DialogTitle>{t('header')}</DialogTitle>
        <div className='flex-1'>
          <Trans
            i18nKey='terms:description'
            components={{
              1: (
                <a
                  href='https://docs.parraton.com/additional-resources/terms-of-service'
                  target='_blank'
                  className='custom-link'
                />
              ),
            }}
          />
        </div>
        <DialogFooter className='w-full'>
          <ButtonV2 onClick={close}>{t('accept')}</ButtonV2>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
