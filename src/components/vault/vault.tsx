'use client';

import { VaultCard, VaultCardProps } from '@components/vault/vault-card';
import { usePreferredCurrency } from '@hooks/use-preferred-currency';
import { Vault as BackendVault } from '@hooks/use-vaults';
import { formatNumberWithDigitsLimit } from '@lib/utils';

import { Language } from '@i18n/settings';
import BigNumber from 'bignumber.js';
import { useMemo } from 'react';

interface VaultProps {
  lng: Language;
  vault: BackendVault;
  depositValue: string;
}

export function Vault({ lng, vault, depositValue }: VaultProps) {
  const { vaultAddressFormatted: address } = vault;
  const { preferredCurrency } = usePreferredCurrency();

  const data = useMemo<VaultCardProps>(() => {
    const totalYield = Number(vault.apy);
    const earnAmount =
      totalYield === undefined || !depositValue
        ? undefined
        : formatNumberWithDigitsLimit(
            new BigNumber(depositValue).times(totalYield).div(100),
            lng,
            4,
          );

    return {
      title: vault.name,
      earnValue: earnAmount ? { amount: earnAmount, currency: preferredCurrency } : undefined,
      totalYield,
      address,
    };
  }, [address, depositValue, lng, preferredCurrency, vault.apy, vault.name]);

  return <VaultCard data={data} locale={lng} />;
}
