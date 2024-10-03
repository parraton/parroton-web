import { languages } from '@i18n/settings';
import { z } from 'zod';

export const Route = {
  name: 'Rewards',
  params: z.object({
    lng: z.enum(languages).optional(),
  }),
};
