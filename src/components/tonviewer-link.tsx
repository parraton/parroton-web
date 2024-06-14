'use client';

import Link from 'next/link';
import { useTranslation } from '@i18n/client';

export interface TonviewerLinkProps {
  hash: string;
}

export function TonviewerLink({ hash }: TonviewerLinkProps) {
  const { t } = useTranslation({ ns: 'transaction' });

  return (
    <Link target='_blank' href={`${process.env.NEXT_PUBLIC_TONVIEWER_URL}/transaction/${hash}`}>
      {t('view_explorer')}
    </Link>
  );
}
