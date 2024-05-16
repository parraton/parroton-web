import { z } from 'zod';
import { languages } from '@i18n/settings';

export const Route = {
  name: 'Home',
  params: z.object({
    lng: z.enum(languages).optional(),
  }),
};
