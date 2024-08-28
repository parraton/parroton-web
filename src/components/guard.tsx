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
        <DialogDescription>{t('description')}</DialogDescription>
        <DialogFooter>
          <Button onClick={close} className='w-100'>
            {t('accept')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
