'use client';
import { VaultCard, VaultCardProps } from '@components/vault/vault-card';
import { useLpBalance } from '@hooks/use-lp-balance';
import { useSharesBalance } from '@hooks/use-shares-balance';

import { Language } from '@i18n/settings';

import { useVaultMetadata } from '@hooks/use-vault-metadata';
import { usePoolNumbers } from '@hooks/use-pool-numbers';

export function Vault({ address, lng }: { address: string; lng: Language }) {
  const { balance: lpBalance } = useLpBalance(address);
  const { balance: sharesBalance } = useSharesBalance(address);
  const { metadata } = useVaultMetadata(address);
  const { poolNumbers } = usePoolNumbers(address);

  const data: VaultCardProps = {
    title: metadata?.name ?? '~~~~',
    balance: lpBalance,
    currency: metadata?.symbol ?? '~~~~',
    deposited: sharesBalance,
    apy: poolNumbers?.apy,
    daily: poolNumbers?.daily,
    extraApr: poolNumbers?.extraApr,
    tvl: poolNumbers?.tvlInUsd,
    address,
  };

  return <VaultCard data={data} locale={lng} />;
}
