'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@UI/dialog';

import { useTranslation } from '@i18n/client';
import type { VaultKpis } from '@hooks/use-vaults';
import { OrLoader } from '@components/loader/loader';
import { useCallback, useState } from 'react';
import { KpiContent } from './kpi-content';
import type { Language } from '@i18n/settings';
import { ButtonV2 } from '@UI/button-v2';

interface KpiDialogProps {
  values?: VaultKpis;
  lng?: Language;
}

export function KpiDialog({ values, lng }: KpiDialogProps) {
  const { t } = useTranslation({ ns: 'kpi' });
  const [open, setOpen] = useState(false);

  const renderKpis = useCallback(
    (values: VaultKpis) => <KpiContent values={values} lng={lng} />,
    [lng],
  );

  const close = useCallback(() => setOpen(false), []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className='h-fit font-semibold text-custom-link'>{t('our_goals')}</button>
      </DialogTrigger>
      <DialogContent className='gap-8'>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{t('our_kpi')}</DialogTitle>
          <DialogDescription>{t('reach_together')}</DialogDescription>
        </DialogHeader>
        <OrLoader animation value={values} modifier={renderKpis} />
        <DialogFooter className='w-full'>
          <ButtonV2 onClick={close}>{t('close')}</ButtonV2>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
