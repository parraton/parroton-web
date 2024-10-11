import type { ZodSchema } from 'zod';
import { OptionalFields, RouteInfo, RouteInfoToLayout } from './makeRoute';
import { Metadata } from 'next';
import { serverTranslation } from '@i18n';

export async function generateFallbackMetadata<
  Info extends OptionalFields<RouteInfo<ZodSchema, ZodSchema>, 'search'>,
>({ params }: RouteInfoToLayout<Info>): Promise<Metadata> {
  const { t } = await serverTranslation(params.lng!, 'common');

  return {
    title: t('app_title'),
    description: t('app_description'),
  };
}
