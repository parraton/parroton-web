'use client';

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader } from '@UI/dialog';
import { Button } from '@UI/button';
import { useEffect, useState } from 'react';
import { useTranslation } from '@i18n/client';

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
        <DialogHeader>{t('header')}</DialogHeader>
        <DialogDescription dangerouslySetInnerHTML={{ __html: t('description') }} />
        <DialogFooter className='w-full'>
          <Button onClick={close} className='w-full bg-[#19A7E7]'>
            {t('accept')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
