import { z } from 'zod';
import { Address } from '@ton/core';

export const zodTonAddressValidator = z.string().refine((value) => {
  try {
    Address.parse(value);
    return true;
  } catch {
    return false;
  }
});
