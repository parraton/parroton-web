'use client';

import { TonviewerLink } from '@components/tonviewer-link';
import { useTranslation } from '@i18n/client';

export function TransactionCompleted({ hash }: { hash: string }) {
  const { t } = useTranslation({ ns: 'transaction' });

  return (
    <div>
      <div>{t('completed')}</div>
      <TonviewerLink hash={hash} />
    </div>
  );
}
