import { z } from 'zod';
import { languages } from '@i18n/settings';

export const Route = {
  name: 'Welcome',
  params: z.object({
    lng: z.enum(languages),
  }),
  search: z.object({
    redirectUrl: z.string().optional(),
  }),
};
