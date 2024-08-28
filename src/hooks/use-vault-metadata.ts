import useSWR from 'swr';
import { getMetadataLink } from '@core';
import { JettonMetadata } from '@types';
import { domain } from '@config/links';

const linkDomain = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : domain;

export const useVaultMetadata = (vaultAddress: string) => {
  const { data, error } = useSWR(['useVaultMetadata', vaultAddress], async () => {
    const metadataLink = await getMetadataLink(vaultAddress);

    const newLink = metadataLink.replace(domain, linkDomain);

    const response = await fetch(newLink);
    return (await response.json()) as JettonMetadata;
  });

  return { metadata: data, error };
};
