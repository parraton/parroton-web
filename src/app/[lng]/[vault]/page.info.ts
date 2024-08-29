import { z } from 'zod';
import { languages } from '@i18n/settings';
import { zodTonAddressValidator } from '@utils/validators';

export const Route = {
  name: 'VaultPage',
  params: z.object({
    lng: z.enum(languages).optional(),
    vault: zodTonAddressValidator,
  }),
  search: z.object({}),
};
