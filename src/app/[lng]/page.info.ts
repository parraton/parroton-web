import { z } from 'zod';
import { languages } from '@i18n/settings';
import { zodTonAddressValidator } from '@utils/validators';

export const Route = {
  name: 'Home',
  params: z.object({
    lng: z.enum(languages).optional(),
  }),
  search: z.object({
    ref: zodTonAddressValidator.optional(),
  }),
};
