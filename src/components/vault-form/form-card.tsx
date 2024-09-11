/* eslint-disable react/jsx-no-literals */
'use client';

import { CardDescription, CardHeader, CardTitle } from '@UI/card';
import { PropsWithChildren } from 'react';
import { Actions } from '@types';
import { GlassCard } from '@components/glass-card';
import Link from 'next/link';
import { useTranslation } from '@i18n/client';

export function FormCard({
  action,
  formattedLpAddress,
  children,
}: PropsWithChildren<{ action: Actions; formattedLpAddress: string | undefined }>) {
  const { t } = useTranslation({ ns: 'form' });

  // TODO: use link in Deposit description, remove hardcoded link & style
  const isDeposit = action === Actions.deposit;

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle>{t(`${action}_title`)}</CardTitle>
        <CardDescription>
          {t(`${action}_description`)}
          {!isDeposit ? (
            t(`${action}_description`)
          ) : (
            <>
              {t(`${action}_description`)} <br />
              {formattedLpAddress && (
                <Link
                  href={`https://dedust.io/pools/${formattedLpAddress}`}
                  style={{ color: '#007bff', textDecoration: 'underline' }}
                >
                  {t('get_lp_description')}
                </Link>
              )}
            </>
          )}
        </CardDescription>
      </CardHeader>
      {children}
    </GlassCard>
  );
}
