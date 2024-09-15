'use client';

import Link from 'next/link';
import { useTranslation } from '@i18n/client';
import { TONVIEWER_URL } from '@config/api.config';

interface TonviewerLinkProps {
  hash: string;
}

export function TonviewerLink({ hash }: TonviewerLinkProps) {
  const { t } = useTranslation({ ns: 'transaction' });

  return (
    <Link target='_blank' href={`${TONVIEWER_URL}/transaction/${hash}`}>
      {t('view_explorer')}
    </Link>
  );
}
