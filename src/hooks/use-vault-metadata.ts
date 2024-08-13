import useSWR from 'swr';
import { getMetadataLink } from '@core';
import { JettonMetadata } from '@types';

const originDomain = 'https://parraton.com/';

const domain =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://parraton.com/';

export const useVaultMetadata = (vaultAddress: string) => {
  const { data, error } = useSWR(['useVaultMetadata', vaultAddress], async () => {
    const metadataLink = await getMetadataLink(vaultAddress);

    const newLink = metadataLink.replace(originDomain, domain);

    const response = await fetch(newLink);
    return (await response.json()) as JettonMetadata;
  });

  return { metadata: data, error };
};
