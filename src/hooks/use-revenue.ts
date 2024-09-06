import { useTonPrice } from '@hooks/use-ton-price';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { fromNano } from '@ton/core';
import { useVaultData } from './use-vault-data';

export function useRevenue(vaultAddress: string) {
  const { tonPrice } = useTonPrice();
  const { vault } = useVaultData(vaultAddress);

  return {
    revenue: multiplyIfPossible(tonPrice, vault ? fromNano(vault.managementFee) : undefined),
  };
}
