import { useTonPrice } from '@hooks/use-ton-price';
import { useManagementFee } from '@hooks/use-management-fee';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { fromNano } from '@ton/core';

export function useRevenue(vaultAddress: string) {
  const { tonPrice } = useTonPrice();
  const { managementFee } = useManagementFee(vaultAddress);

  return {
    revenue: multiplyIfPossible(tonPrice, managementFee ? fromNano(managementFee) : undefined),
  };
}
