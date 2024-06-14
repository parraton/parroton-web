import useSWR from 'swr';
import { JettonMetadata } from '@types';
import { usePool } from '@hooks/use-pool';

const domain =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://parroton.org/';

export const usePoolMetadata = (vaultAddress: string) => {
  const { pool } = usePool(vaultAddress);

  const { data, error } = useSWR([vaultAddress, Boolean(pool)], async () => {
    if (!pool) return null;
    try {
      const newLink = `${pool.toRawString()}.json`;

      const response = await fetch(new URL(newLink, domain));
      return (await response.json()) as JettonMetadata;
    } catch (error) {
      throw error;
    }
  });

  return { metadata: data, error };
};
