'use client';

import { useTranslation } from '@i18n/client';

export function TransactionFailed() {
  const { t } = useTranslation({ ns: 'transaction' });
  return (
    <div>
      <div>{t('failed')}</div>
    </div>
  );
}
