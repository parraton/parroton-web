'use client';
import { VaultCard, VaultCardProps } from '@components/vault/vault-card';
import { useLpBalance } from '@hooks/use-lp-balance';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { usePool } from '@hooks/use-pool';

import { Language } from '@i18n/settings';
import { Suspense } from 'react';
import { JettonRoot } from '@dedust/sdk';
import { tonClient } from '@core/config';
import { Address } from '@ton/core';
import { JettonMetadata } from '@types';
import useSWR from 'swr';

const getMetadataLink = async (vaultAddress: string) => {
  const rawPoolJetton = JettonRoot.createFromAddress(Address.parse(vaultAddress));
  const poolJetton = tonClient.open(rawPoolJetton);
  const { content } = await poolJetton.getJettonData();

  const slice = content.beginParse();

  slice.loadUint(8);

  return slice.loadStringTail();
};

const useVaultMetadata = (vaultAddress: string) => {
  const { data, error } = useSWR([vaultAddress], async () => {
    const metadataLink = await getMetadataLink(vaultAddress);
    const response = await fetch(metadataLink);
    return (await response.json()) as JettonMetadata;
  });

  return { metadata: data, error };
};

const usePoolNumbers = (vaultAddress: string) => {
  const { pool } = usePool(vaultAddress.toString());

  console.log({ pool });

  return {
    apy: '7.94',
    daily: '0.02',
    tvl: '1298343.32',
  };
};

export function Vault({ address, lng }: { address: string; lng: Language }) {
  const { balance: lpBalance } = useLpBalance(address);
  const { balance: sharesBalance } = useSharesBalance(address);
  const { metadata } = useVaultMetadata(address);
  const { apy, daily, tvl } = usePoolNumbers(address);

  const data: VaultCardProps = {
    title: metadata?.name ?? '~~~~',
    balance: lpBalance,
    currency: metadata?.symbol ?? '~~~~',
    deposited: sharesBalance,
    apy,
    daily,
    tvl,
    address,
  };

  return (
    <Suspense>
      <VaultCard data={data} locale={lng} />
    </Suspense>
  );
}
