import { serverTranslation } from '@i18n';
import { Language } from '@i18n/settings';
import { CardDescription, CardHeader, CardTitle } from '@UI/card';
import { PropsWithChildren } from 'react';
import { Actions } from '@types';
import { GlassCard } from '@components/glass-card';

export async function FormCard({
  action,
  lng,
  children,
}: PropsWithChildren<{ lng: Language; action: Actions }>) {
  const { t } = await serverTranslation(lng, 'form');

  return (
    <GlassCard>
      <CardHeader>
        <CardTitle>{t(`${action}_title`)}</CardTitle>
        <CardDescription>{t(`${action}_description`)}</CardDescription>
      </CardHeader>
      {children}
    </GlassCard>
  );
}
