import { useVaultTvl } from '@hooks/use-vault-tvl';
import { useVaultApy } from '@hooks/use-vault-apy';

export const usePoolNumbers = (vaultAddress: string) => {
  const { tvlData } = useVaultTvl(vaultAddress);
  const { apyData } = useVaultApy(vaultAddress, tvlData);

  return {
    poolNumbers: tvlData && apyData ? { ...apyData, ...tvlData } : undefined,
  };
};
