import { z } from 'zod';

export const Route = {
  name: 'ApiTonClientPath',
  params: z.object({
    path: z.string().array(),
  }),
  search: z.any(),
};
