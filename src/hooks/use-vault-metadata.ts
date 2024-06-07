import useSWR from 'swr';
import { getMetadataLink } from '@core';
import { JettonMetadata } from '@types';

const wrongDomain = 'https://parrot-joe.com/';

const domain =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://parroton.org/';

export const useVaultMetadata = (vaultAddress: string) => {
  const { data, error } = useSWR([vaultAddress], async () => {
    const metadataLink = await getMetadataLink(vaultAddress);

    const newLink = metadataLink.replace(wrongDomain, domain);

    const response = await fetch(newLink);
    return (await response.json()) as JettonMetadata;
  });

  return { metadata: data, error };
};
