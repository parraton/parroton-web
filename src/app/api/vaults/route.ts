import memoizee from 'memoizee';
import asyncRetry from 'async-retry';

import { NextResponse } from 'next/server';
import { Address, fromNano } from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { TonJettonTonStrategy, Vault } from '@parraton/sdk';

import { tonApiHttpClient } from '../../../core/tonapi';

export const dynamic = 'force-dynamic';

const TON_CLIENT = new TonClient4({
  endpoint: process.env.NEXT_PUBLIC_TON_CLIENT_URL!,
  timeout: 60_000,
});
const VAULT_NAME = 'USDT/TON Vault';
const VAULT_ADDRESS = '0:bb309547a688b8eb328938a5765cb998334d2cea2b6dc511406f8274fb6d2220';

const RETRY_CONFIG = {
  retries: 5,
  minTimeout: 2000,
  maxTimeout: 20_000,
};

export async function GET() {
  const vaults = await getVaults();

  return NextResponse.json(vaults);
}

const getVaults = memoizee(
  async () => {
    const lpAddress = await getLPAddress(VAULT_ADDRESS);
    const { lpPrice, poolTvlUsd } = await getDedustLPInfo(lpAddress.toString());
    const tvlUsd = await getVaultTVLUSD(VAULT_ADDRESS, lpPrice);
    const rewardsStats = await getRewardsStats(lpAddress.toString(), poolTvlUsd);

    return [
      {
        name: VAULT_NAME,
        vaultAddress: VAULT_ADDRESS,
        plpMetadata: (await getPLPMetadata(VAULT_ADDRESS)).metadata,
        lpMetadata: (await getLPMetadata(VAULT_ADDRESS)).metadata,
        lpPriceUsd: lpPrice.toFixed(2),
        plpPriceUsd: (await getVaultLPPriceUSD(lpPrice, VAULT_ADDRESS)).toFixed(2),
        tvlUsd: tvlUsd.toFixed(2),
        apr: rewardsStats.apr.toFixed(4),
        apy: rewardsStats.apy.toFixed(4),
        dailyUsdRewards: rewardsStats.daily.toFixed(4),
      },
    ];
  },
  {
    maxAge: 60_000,
    promise: true,
    preFetch: true,
  },
);

const getPLPMetadata = memoizee(
  async (vaultAddress: string) => {
    return tonApiHttpClient.jettons.getJettonInfo(vaultAddress);
  },
  {
    maxAge: 24 * 60 * 60 * 1000, // 1 day

    promise: true,
  },
);

const getLPAddress = memoizee(
  async (vaultAddress: string) => {
    const vaultAddressParsed = Address.parse(vaultAddress.toString());
    const strategyInfo = await getStrategyInfoByVault(vaultAddressParsed);
    return strategyInfo.poolAddress;
  },
  {
    maxAge: 24 * 60 * 60 * 1000, // 1 day

    promise: true,
  },
);

const getLPMetadata = memoizee(
  async (vaultAddress: string) => {
    const lpAddress = await getLPAddress(vaultAddress);
    return tonApiHttpClient.jettons.getJettonInfo(lpAddress.toString());
  },
  {
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    promise: true,
  },
);

const getVaultData = memoizee(
  async (vaultAddress: Address) => {
    const rawVault = Vault.createFromAddress(vaultAddress);
    const vault = TON_CLIENT.open(rawVault);

    return asyncRetry(() => vault.getVaultData(), RETRY_CONFIG);
  },
  {
    maxAge: 60_000,
    promise: true,
  },
);

const getDedustV3Pool = memoizee(
  async (address: string) => {
    const operationName = 'GetPool';
    const query =
      'query GetPool($address: ID!) { pool(address: $address) { totalSupply assets reserves } }';

    const variables = {
      address,
    };

    return fetchDedustV3Api<{
      pool: {
        totalSupply: string;
        assets: [string, string];
        reserves: [string, string];
      };
    }>(operationName, query, variables);
  },
  {
    maxAge: 60_000,
    promise: true,
  },
);

const getDedustLPInfo = memoizee(
  async (lpAddress: string) => {
    const { pool } = await getDedustV3Pool(lpAddress);
    const [asset1Type, asset1Address] = pool.assets[0].split(':');
    const [asset2Type, asset2Address] = pool.assets[1].split(':');

    const allDedustAssets = await getAllDedustAssets();

    const asset1 = allDedustAssets.assets.find(
      (asset) => asset.address == asset1Address && asset.type == asset1Type,
    );
    const asset2 = allDedustAssets.assets.find(
      (asset) => asset.address == asset2Address && asset.type == asset2Type,
    );

    if (!asset1 || !asset2) {
      throw new Error('Asset not found');
    }

    const [reserve1, reserve2] = pool.reserves.map(BigInt);

    const oneLP = 1_000_000_000n;
    const totalSupply = BigInt(pool.totalSupply);

    const assetOneUnderLP = (oneLP * reserve1) / totalSupply;
    const assetTwoUnderLP = (oneLP * reserve2) / totalSupply;

    const asset1Price = Number(asset1.price);
    const asset2Price = Number(asset2.price);

    const precision = 10_000;

    const lpPrice =
      (Number((assetOneUnderLP * BigInt(precision)) / 10n ** BigInt(asset1.decimals)) / precision) *
        asset1Price +
      (Number((assetTwoUnderLP * BigInt(precision)) / 10n ** BigInt(asset2.decimals)) / precision) *
        asset2Price;

    return {
      lpPrice,
      asset1Price,
      asset2Price,
      poolTvlUsd: (Number((totalSupply * BigInt(precision)) / oneLP) * lpPrice) / precision,
    };
  },
  {
    maxAge: 60_000,
    promise: true,
  },
);

const getAllDedustAssets = memoizee(
  async () => {
    const operationName = 'GetAllAssets';
    const query = 'query GetAllAssets { assets { type address price decimals } }';

    return fetchDedustV3Api<{
      assets: {
        type: string;
        address: string;
        price: string;
        decimals: number;
      }[];
    }>(operationName, query, {});
  },
  {
    maxAge: 60_000,

    promise: true,
  },
);

const getVaultLPPriceUSD = memoizee(
  async (lpPrice: number, vaultAddress: string) => {
    const rawVault = Vault.createFromAddress(Address.parse(vaultAddress));
    const vault = TON_CLIENT.open(rawVault);
    const estimatedLpAmount = await asyncRetry(
      () => vault.getEstimatedLpAmount(1_000_000_000n),
      RETRY_CONFIG,
    );

    const precision = 1000;

    return (Number((estimatedLpAmount * BigInt(precision)) / 10n ** 9n) * lpPrice) / precision;
  },
  {
    maxAge: 60_000,
    promise: true,
  },
);

const getVaultTVLUSD = memoizee(
  async (vaultAddress: string, lpPriceUSD: number) => {
    const {
      last: { seqno },
    } = await asyncRetry(() => TON_CLIENT.getLastBlock(), RETRY_CONFIG);
    const { account } = await asyncRetry(
      () => TON_CLIENT.getAccountLite(seqno, Address.parse(vaultAddress)),
      RETRY_CONFIG,
    );
    const balance = fromNano(account.balance.coins);
    const tonPrice = await getTonPrice();

    const vaultData = await getVaultData(Address.parse(vaultAddress));
    const precision = 1000;

    const tvl =
      (Number((vaultData.depositedLp * BigInt(precision)) / 10n ** 9n) / precision) * lpPriceUSD +
      Number(balance) * tonPrice;

    return tvl;
  },
  {
    maxAge: 60_000,
    promise: true,
  },
);

const getTonPrice = memoizee(
  async () => {
    const { rates } = await tonApiHttpClient.rates.getRates({
      currencies: ['USD'],
      tokens: ['TON'],
    });

    const rate = rates['TON'].prices?.['USD'];

    if (!rate) {
      throw new Error('TON price not found');
    }

    return rate;
  },
  {
    maxAge: 60_000,
    promise: true,
  },
);

const getAllTonBoosts = memoizee(
  async () => {
    const fetchResult = await fetchDedustV3Api<{
      boosts: {
        liquidityPool: string;
        asset: string;
        budget: string;
        rewardPerDay: string;
        startAt: string;
        endAt: string;
      }[];
    }>(
      'GetAllBoosts',
      'query GetAllBoosts { boosts { liquidityPool asset budget rewardPerDay startAt endAt } }',
      {},
    );

    return fetchResult.boosts;
  },
  {
    maxAge: 60_000 * 5,
    promise: true,
  },
);

const getRewardsStats = memoizee(
  async (lpAddress: string, tvlUsd: number) => {
    const allBoosts = await getAllTonBoosts();
    const nativeBoost = allBoosts.find(
      (boost) =>
        boost.liquidityPool == lpAddress &&
        boost.asset === 'native' &&
        new Date(boost.startAt) < new Date() &&
        new Date(boost.endAt) > new Date(),
    );

    const dailyRewards = nativeBoost?.rewardPerDay ? Number(fromNano(nativeBoost.rewardPerDay)) : 0;

    const dailyRewardsUsd = dailyRewards * (await getTonPrice());
    const apr = (dailyRewardsUsd * 365) / tvlUsd;
    const apy = (1 + apr / 100) ** 365 - 1;

    return {
      apy,
      apr,
      daily: dailyRewardsUsd,
    };
  },
  {
    maxAge: 60_000 * 10,
    promise: true,
  },
);

const getStrategyInfoByVault = memoizee(
  async (vaultAddress: Address) => {
    const { strategyAddress } = await getVaultData(vaultAddress);
    const rawStrategy = TonJettonTonStrategy.createFromAddress(strategyAddress);
    const strategy = TON_CLIENT.open(rawStrategy);

    return asyncRetry(() => strategy.getStrategyData(), {
      retries: 5,
      minTimeout: 2000,
      maxTimeout: 20_000,
    });
  },
  {
    maxAge: 60_000 * 5,
    promise: true,
  },
);

const fetchDedustV3Api = async <Response = unknown, Vars = unknown>(
  operationName: string,
  query: string,
  variables: Vars,
): Promise<Response> => {
  const url = 'https://api.dedust.io/v3/graphql';
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      operationName,
      query,
      variables,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const json = (await response.json()) as { data: Response };
  return json.data;
};
