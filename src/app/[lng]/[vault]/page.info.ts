import { z } from 'zod';
import { languages } from '@i18n/settings';
import { Address } from '@ton/core';

const zodTonAddressValidator = z.string().refine((value) => {
  try {
    Address.parse(value);
    return true;
  } catch {
    return false;
  }
});

export const Route = {
  name: 'VaultPage',
  params: z.object({
    lng: z.enum(languages).optional(),
    vault: zodTonAddressValidator,
  }),
  search: z.object({}),
};
