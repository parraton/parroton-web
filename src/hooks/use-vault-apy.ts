import { useDedustDistributionPool } from "@hooks/use-dedust-distribution-pool";
import { useVaultDistributionPool } from "@hooks/use-vault-distribution-pool";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { calculateApy } from "@utils/calculate-apy";
import { getDedustRewards, getVaultRewards } from "@core";

const percentage = 100;
const countOfReinvests = 365;
const numberOfWeeks = 52;

export const useVaultApy = (
  vaultAddress: string,
  tvlData?: { tvlInTon: string }
) => {
  const { distributionPool: dedustDistributionPool } =
    useDedustDistributionPool(vaultAddress);
  const { distributionPool: vaultDistributionPool } =
    useVaultDistributionPool(vaultAddress);

  const [apy, setApy] = useState<string | null>(null);
  const [extraApr, setExtraApr] = useState<string | null>(null);

  const { data: dedustRewards, error } = useSWR(
    ["dedust-rewards", vaultAddress, Boolean(dedustDistributionPool)],
    async () => {
      if (!dedustDistributionPool) return;
      console.log("dedust-rewards", vaultAddress, dedustDistributionPool);

      return await getDedustRewards(vaultAddress, dedustDistributionPool);
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  const { data: vaultRewards } = useSWR(
    ["vault-rewards", vaultAddress, Boolean(vaultDistributionPool)],
    async () => {
      if (!vaultDistributionPool) return;
      console.log("vault-rewards", vaultAddress, vaultDistributionPool);

      return await getVaultRewards(vaultDistributionPool);
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: false,
      revalidateOnReconnect: false,
      refreshWhenOffline: false,
      refreshWhenHidden: false,
      revalidateIfStale: false,
      refreshInterval: 0,
    }
  );

  useEffect(() => {
    if (!tvlData || !(dedustRewards || vaultRewards)) return;

    const apr =
      (Number(dedustRewards || "0") / Number(tvlData.tvlInTon)) *
      numberOfWeeks *
      percentage;
    const extraApr =
      (Number(vaultRewards || "0") / Number(tvlData.tvlInTon)) *
      numberOfWeeks *
      percentage;

    setApy(calculateApy(apr, countOfReinvests).toFixed(2));
    setExtraApr(extraApr.toFixed(2));
  }, [dedustRewards, vaultRewards, tvlData, vaultAddress]);

  return {
    apyData: {
      apy,
      extraApr,
      daily: apy ? (Number(apy) / countOfReinvests).toFixed(2) : undefined,
    },
    error,
  };
};
