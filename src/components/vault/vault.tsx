'use client';
import { VaultCard, VaultCardProps } from '@components/vault/vault-card';
import { useLpBalance } from '@hooks/use-lp-balance';
import { useSharesBalance } from '@hooks/use-shares-balance';

import { Language } from '@i18n/settings';
import { JettonRoot } from '@dedust/sdk';
import { tonClient } from '@core/config';
import { Address, fromNano, OpenedContract } from '@ton/core';
import { JettonMetadata } from '@types';
import useSWR from 'swr';
import { useTonPrice } from '@hooks/use-ton-price';

import { useDedustDistributionPool } from '@hooks/use-dedust-distribution-pool';
import { tonApiHttpClient } from '@core/tonapi';
import { DistributionPool } from '@dedust/apiary-v1';

const getMetadataLink = async (vaultAddress: string) => {
  const rawPoolJetton = JettonRoot.createFromAddress(Address.parse(vaultAddress));
  const poolJetton = tonClient.open(rawPoolJetton);
  const { content } = await poolJetton.getJettonData();

  const slice = content.beginParse();

  slice.loadUint(8);

  return slice.loadStringTail();
};

const wrongDomain = 'https://parrot-joe.com/';

const domain =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : 'https://parroton.org/';

const useVaultMetadata = (vaultAddress: string) => {
  const { data, error } = useSWR([vaultAddress], async () => {
    const metadataLink = await getMetadataLink(vaultAddress);

    const newLink = metadataLink.replace(wrongDomain, domain);

    const response = await fetch(newLink);
    return (await response.json()) as JettonMetadata;
  });

  return { metadata: data, error };
};

const getDedustRewards = async (
  vaultAddress: string,
  distributionPool: OpenedContract<DistributionPool>,
) => {
  const { tokenWalletAddress } = await distributionPool.getPoolExtraData();

  const { events } = await tonApiHttpClient.accounts.getAccountEvents(
    tokenWalletAddress.toString(),
    {
      limit: 100,
    },
  );

  const filteredActions = [];

  for (const event of events) {
    const { actions } = event;
    for (const action of actions) {
      const { type } = action;
      if (type !== 'TonTransfer' || !('TonTransfer' in action)) {
        continue;
      }

      const { TonTransfer } = action;
      const { sender, recipient } = TonTransfer!;

      const isWalletSender =
        Address.parse(sender.address).toString() === tokenWalletAddress.toString();
      const isVaultRecipient =
        Address.parse(recipient.address).toString() === Address.parse(vaultAddress).toString();
      if (isWalletSender && isVaultRecipient) {
        filteredActions.push(action);
        break;
      }
    }
  }

  const value = filteredActions.reduce((acc, action) => {
    return acc + BigInt(action.TonTransfer!.amount);
  }, BigInt(0));

  const amount = fromNano(value);

  console.log({ filteredActions, amount });

  return amount;
};

const useVaultApy = (vaultAddress: string) => {
  const { distributionPool } = useDedustDistributionPool(vaultAddress);

  const { data: apyData, error } = useSWR(
    ['vault-apy', vaultAddress, Boolean(distributionPool)],
    async () => {
      if (!distributionPool) return;

      const rewards = await getDedustRewards(vaultAddress, distributionPool);

      console.log({ dedustRewards: rewards });

      return {
        apy: '7.94',
        daily: '0.02',
      };
    },
    {
      refreshInterval: 10_000,
    },
  );

  return { apyData, error };
};

const useVaultTvl = (vaultAddress: string) => {
  const { tonPrice } = useTonPrice();
  const { distributionPool } = useDedustDistributionPool(vaultAddress);

  const { data: tvlData, error } = useSWR(
    ['vault-numbers', vaultAddress, tonPrice, Boolean(distributionPool)],
    async () => {
      if (!distributionPool) return;

      const {
        last: { seqno },
      } = await tonClient.getLastBlock();

      const { account } = await tonClient.getAccountLite(seqno, Address.parse(vaultAddress));

      const balance = fromNano(account.balance.coins);

      const poolTvl = Number(balance) * 2 * Number(tonPrice);

      return {
        tvl: `${poolTvl}`,
      };
    },
    {
      refreshInterval: 10_000,
    },
  );

  return { tvlData, error };
};

const usePoolNumbers = (vaultAddress: string) => {
  const { tvlData } = useVaultTvl(vaultAddress);
  const { apyData } = useVaultApy(vaultAddress);

  return {
    poolNumbers: tvlData && apyData ? { ...apyData, ...tvlData } : undefined,
  };
};

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
    tvl: poolNumbers?.tvl,
    address,
  };

  return <VaultCard data={data} locale={lng} />;
}
