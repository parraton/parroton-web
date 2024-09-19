'use client';
import { VaultCard, VaultCardProps } from '@components/vault/vault-card';
import { useLpBalance } from '@hooks/use-lp-balance';
import { useSharesBalance } from '@hooks/use-shares-balance';
import { Vault as BackendVault } from '@hooks/use-vaults';

import { Language } from '@i18n/settings';

export function Vault({ lng, vault }: { lng: Language; vault: BackendVault }) {
  const { vaultAddressFormatted: address } = vault;
  const { balance: lpBalance, error: lpError } = useLpBalance(address);
  const { balance: sharesBalance, error: sharesError } = useSharesBalance(address);

  const data: VaultCardProps = {
    title: vault.name,
    balance: lpBalance,
    currency: vault.plpMetadata?.symbol,
    deposited: sharesBalance === null ? null : sharesBalance?.lpBalance,
    apy: vault.apy,
    daily: vault.dpr,
    extraApr: '0',
    tvl: vault.tvlUsd,
    address,
    isLpError: !!lpError,
    isSharesError: !!sharesError,
  };

  return <VaultCard data={data} locale={lng} />;
}
