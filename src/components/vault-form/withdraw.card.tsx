import { serverTranslation } from '@i18n';
import { Language } from '@i18n/settings';
import { Card, CardDescription, CardHeader, CardTitle } from '@UI/card';
import { PropsWithChildren } from 'react';

export async function WithdrawCard({ lng, children }: PropsWithChildren<{ lng: Language }>) {
  const { t } = await serverTranslation(lng, 'form');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('withdraw_title')}</CardTitle>
        <CardDescription>{t('withdraw_description')}</CardDescription>
      </CardHeader>
      {children}
    </Card>
  );
}
