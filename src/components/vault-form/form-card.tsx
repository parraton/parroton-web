'use client';

import { Language } from '@i18n/settings';
import { CardDescription, CardHeader, CardTitle } from '@UI/card';
import { PropsWithChildren } from 'react';
import { Actions } from '@types';
import { GlassCard } from '@components/glass-card';
import Link from 'next/link';
import { useTranslation } from '@i18n/client';

export function FormCard({
  action,
  lng,
  children,
  formattedLpAddress,
}: PropsWithChildren<{ lng: Language; action: Actions; formattedLpAddress?: string }>) {
  const { t } = useTranslation({ ns: 'form', lng });

  // TODO: use link in Deposit description, remove hardcoded link & style
  const isDeposit = action === Actions.depositOrWithdraw;

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle>{t(`${action}_title`)}</CardTitle>
        <CardDescription>
          {!isDeposit ? (
            t(`${action}_description`)
          ) : (
            <>
              {t(`${action}_description`)} <br />
              <Link href={`https://dedust.io/pools/${formattedLpAddress}`}>
                <span className='custom-link'>{t('get_lp_description')}</span>
              </Link>
            </>
          )}
        </CardDescription>
      </CardHeader>
      {children}
    </GlassCard>
  );
}
