'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@UI/dialog';

import { useTranslation } from '@i18n/client';
import type { VaultKpis } from '@hooks/use-vaults';
import { OrLoader } from '@components/loader/loader';
import { useCallback } from 'react';
import { KpiContent } from './kpi-content';
import type { Language } from '@i18n/settings';

interface KpiDialogProps {
  values?: VaultKpis;
  lng?: Language;
}

export function KpiDialog({ values, lng }: KpiDialogProps) {
  const { t } = useTranslation({ ns: 'kpi' });

  const renderKpis = useCallback(
    (values: VaultKpis) => <KpiContent values={values} lng={lng} />,
    [lng],
  );

  return (
    <Dialog>
      <DialogTrigger>
        <p className='custom-link bold'>{t('wanna_know_our_goals')}</p>
      </DialogTrigger>
      <DialogContent className={`custom-dialog custom-modal-settings sm:max-w-md`}>
        <DialogHeader>
          <DialogTitle className='text-2xl'>{t('our_kpi')}</DialogTitle>
          <DialogDescription>{t('reach_together')}</DialogDescription>
        </DialogHeader>
        <OrLoader animation value={values} modifier={renderKpis} />
      </DialogContent>
    </Dialog>
  );
}
