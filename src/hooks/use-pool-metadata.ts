import useSWR from 'swr';
import { getMetadataLink } from '@core';
import { JettonMetadata } from '@types';
import { usePool } from '@hooks/use-pool';

const wrongDomain = 'https://parrot-joe.com/';

const domain =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://parroton.org/';

export const usePoolMetadata = (vaultAddress: string) => {
  const { pool } = usePool(vaultAddress);

  const { data, error } = useSWR([vaultAddress, Boolean(pool)], async () => {
    if (!pool) return null;

    const metadataLink = await getMetadataLink(pool.toString());

    const newLink = metadataLink.replace(wrongDomain, domain);

    const response = await fetch(newLink);
    return (await response.json()) as JettonMetadata;
  });

  return { metadata: data, error };
};
