import { useVaultDistributionPool } from '@hooks/use-vault-distribution-pool';
import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';
import useSWR from 'swr';
import { getRewardsDictionary } from '@components/claim/claim';
import { Address, fromNano, OpenedContract } from '@ton/core';
import { tonClient } from '@core/config';
import { DistributionAccount, DistributionPool } from '@dedust/apiary-v1';
import { useCallback, useMemo } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';

function useDistributionAccount(distributionPool: OpenedContract<DistributionPool> | null) {
  const walletAddress = useTonAddress();

  const getDistributionAccountAddress = useCallback(async () => {
    if (!distributionPool || !walletAddress) return null;
    return await distributionPool.getAccountAddress(Address.parse(walletAddress));
  }, [distributionPool, walletAddress]);
  const { data: distributionAccountAddress } = useSWR(
    ['distribution-account-address', distributionPool?.address.toString(), walletAddress],
    getDistributionAccountAddress,
    { shouldRetryOnError: true, errorRetryInterval: 5000, suspense: false },
  );

  const distributionAccount = useMemo(() => {
    if (!distributionAccountAddress) return null;

    return tonClient.open(DistributionAccount.createFromAddress(distributionAccountAddress));
  }, [distributionAccountAddress]);

  return {
    distributionAccount,
  };
}

export function useRewardsBalance() {
  const walletAddress = useTonAddress();
  const { vault } = useParams(VaultPage);
  const { distributionPool } = useVaultDistributionPool(vault);
  const { distributionAccount } = useDistributionAccount(distributionPool);

  const { data, error } = useSWR(
    ['rewards-balance', Boolean(distributionAccount), Boolean(distributionPool), walletAddress],
    async () => {
      if (!walletAddress || !distributionPool || !distributionAccount) return null;

      try {
        let totalPaid = 0n;
        try {
          const result = await distributionAccount.getAccountData();
          totalPaid = result.totalPaid;
        } catch {}

        const rewardsDictionary = await getRewardsDictionary(distributionPool);

        const value = rewardsDictionary.get(Address.parse(walletAddress));

        return value ? fromNano(value - totalPaid) : undefined;
      } catch (error) {
        if (
          (error as Error)?.message.includes('-256') ||
          (error as Error)?.message.includes('Data URI')
        ) {
          return '0';
        } else {
          throw error;
        }
      }
    },
    { refreshInterval: 10_000 },
  );

  return {
    balance: data,
    error,
  };
}
