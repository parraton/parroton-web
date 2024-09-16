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

type VaultsApiResponse = Array<{
  name: string;
  vaultAddress: string;
  vaultAddressFormatted: string;
  plpMetadata: {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    image: string;
    description: string;
  };
  lpMetadata: {
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    image: string;
  };
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
}>;

function fetchVaults(): Promise<VaultsApiResponse> {
  return fetch(VAULTS_API)
    .then((response) => response.json())
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
