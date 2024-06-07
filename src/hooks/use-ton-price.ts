import { tonApiHttpClient } from '@core/tonapi';
import useSWR from 'swr';

export const useTonPrice = () => {
  const { data, error } = useSWR('ton-price', async () => {
    const { rates } = await tonApiHttpClient.rates.getRates({
      currencies: ['USD'],
      tokens: ['TON'],
    });

    return rates['TON'].prices?.['USD'];
  });

  return {
    tonPrice: data,
    error,
  };
};
