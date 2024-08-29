import useSWR from 'swr';
import { JettonMetadata } from '@types';
import { usePool } from '@hooks/use-pool';
import { domain } from '@config/links';

const linkDomain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : domain;

export const usePoolMetadata = (vaultAddress: string) => {
  const { pool } = usePool(vaultAddress);

  const { data, error } = useSWR(['usePoolMetadata', vaultAddress, Boolean(pool)], async () => {
    if (!pool) return null;
    const newLink = `${pool.toRawString()}.json`;

    const response = await fetch(new URL(newLink, linkDomain));
    return (await response.json()) as JettonMetadata;
  });

  return { metadata: data, error };
};
