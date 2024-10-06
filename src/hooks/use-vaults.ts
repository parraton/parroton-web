import useSWR from 'swr';
import { VAULTS_API } from '@config/api.config';

export interface VaultKpis {
  tvl: {
    target: string;
    current: string;
  };
  liquidityFraction: {
    target: string;
    current: string;
  };
  revenue: {
    target: string;
    current: number;
  };
}

export interface Asset {
  address: string;
  name: string;
  symbol: string;
  decimals: string;
  image: string;
  description?: string;
}

export interface Vault {
  name: string;
  vaultAddress: string;
  vaultAddressFormatted: string;
  plpMetadata: Asset;
  lpMetadata: Asset;
  lpTotalSupply: string;
  plpTotalSupply: string;
  lpPriceUsd: string;
  plpPriceUsd: string;
  tvlUsd: string;
  pendingRewardsUSD: string;
  dpr: string;
  apr: string;
  apy: string;
  dailyUsdRewards: string;
  managementFee: string;
  kpis: VaultKpis;
  assets: Asset[];
}

function fetchVaults(): Promise<Vault[]> {
  return fetch(VAULTS_API)
    .then((response) => {
      if (response.status >= 400) {
        throw new Error(`Request for vaults failed with status ${response.status}`);
      }

      return response.json();
    })
    .then((data) => data);
}

export function useVaults() {
  const { data, isLoading, error } = useSWR('vaults', fetchVaults, {
    refreshInterval: 60_000,
  });

  return {
    vaults: data,
    isLoading,
    error,
  };
}
