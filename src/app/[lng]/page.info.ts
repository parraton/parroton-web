import { z } from 'zod';

export const Route = {
  name: 'Home',
  params: z.object({
    lng: z.string().optional(),
  }),
};
