import { serverTranslation } from '@i18n';
import { Language } from '@i18n/settings';
import { Card, CardDescription, CardHeader, CardTitle } from '@UI/card';
import { PropsWithChildren } from 'react';

export async function DepositCard({ lng, children }: PropsWithChildren<{ lng: Language }>) {
  const { t } = await serverTranslation(lng, 'form');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('deposit_title')}</CardTitle>
        <CardDescription>{t('deposit_description')}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
}
