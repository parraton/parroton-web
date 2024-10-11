import { languages } from '@i18n/settings';
import { z } from 'zod';

export const Route = {
  name: 'Settings',
  params: z.object({
    lng: z.enum(languages).optional(),
  }),
  search: z.any(),
};
