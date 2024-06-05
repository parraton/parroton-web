import {z} from 'zod';
import {languages} from '@i18n/settings';

export enum actions {
  deposit = 'deposit',
  withdraw = 'withdraw',
}

export const Route = {
  name: 'VaultPage',
  params: z.object({
    lng: z.enum(languages).optional(),
    vault: z.string(),
  }),
  search: z.object({}),
};
