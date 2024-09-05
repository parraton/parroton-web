import { z } from 'zod';

export const Route = {
  name: 'VaultsGet',
  params: z.object({}),
  search: z.object({}),
};

export const GET = {
  result: z.array(
    z.object({
      name: z.string(),
      vaultAddress: z.string(),
      plpMetadata: z.object({
        address: z.string(),
        name: z.string(),
        symbol: z.string(),
        decimals: z.string(),
        image: z.string(),
        description: z.string(),
      }),
      lpMetadata: z.object({
        address: z.string(),
        name: z.string(),
        symbol: z.string(),
        decimals: z.string(),
        image: z.string(),
      }),
      lpPriceUsd: z.string(),
      plpPriceUsd: z.string(),
      tvlUsd: z.string(),
      apr: z.string(),
      apy: z.string(),
      dailyUsdRewards: z.string(),
    }),
  ),
};
