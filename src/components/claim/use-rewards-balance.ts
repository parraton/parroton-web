import { useVaultDistributionPool } from '@hooks/use-vault-distribution-pool';
import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';
import useSWR from 'swr';
import { useConnection } from '@hooks/use-connection';
import { getRewardsDictionary } from '@components/claim/claim';
import { fromNano, OpenedContract } from '@ton/core';
import { tonClient } from '@core/config';
import { DistributionAccount, DistributionPool } from '@dedust/apiary-v1';
import { useCallback, useMemo } from 'react';

function useDistributionAccount(distributionPool: OpenedContract<DistributionPool> | null) {
  const {
    sender: { address },
  } = useConnection();

  const getDistributionAccountAddress = useCallback(async () => {
    if (!distributionPool || !address) return null;

    return await distributionPool.getAccountAddress(address);
  }, [distributionPool, address]);
  const { data: distributionAccountAddress } = useSWR(
    ['distribution-account-address', distributionPool?.address.toString(), address?.toString()],
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
  const { sender } = useConnection();
  const { vault } = useParams(VaultPage);
  const { distributionPool } = useVaultDistributionPool(vault);
  const { distributionAccount } = useDistributionAccount(distributionPool);

  const { data, error } = useSWR(
    [
      'rewards-balance',
      Boolean(distributionAccount),
      Boolean(distributionPool),
      sender.address?.toString(),
    ],
    async () => {
      if (!sender.address || !distributionPool || !distributionAccount) return null;

      try {
        let totalPaid = 0n;
        try {
          const result = await distributionAccount.getAccountData();
          totalPaid = result.totalPaid;
        } catch {}

        const rewardsDictionary = await getRewardsDictionary(distributionPool);

        const value = rewardsDictionary.get(sender.address);

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
    { refreshInterval: 5000 },
  );

  return {
    balance: data,
    error,
  };
}
