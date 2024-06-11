'use client';

import { useTranslation } from '@i18n/client';

export function TransactionSent() {
  const { t } = useTranslation({ ns: 'transaction' });
  return (
    <div>
      <div>{t('sent')}</div>
    </div>
  );
}
