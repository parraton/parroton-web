import { useVaultDistributionPool } from '@hooks/use-vault-distribution-pool';
import { VaultPage } from '@routes';
import { useParams } from '@routes/hooks';
import useSWR from 'swr';
import { useConnection } from '@hooks/use-connection';
import { getRewardsDictionary } from '@components/claim/claim';
import { fromNano, OpenedContract } from '@ton/core';
import { tonClient } from '@core/config';
import { DistributionAccount, DistributionPool } from '@dedust/apiary-v1';
import { useEffect, useState } from 'react';

function useDistributionAccount(distributionPool: OpenedContract<DistributionPool> | null) {
  const {
    sender: { address },
  } = useConnection();
  const [distributionAccount, setDistributionAccount] =
    useState<OpenedContract<DistributionAccount> | null>(null);

  useEffect(() => {
    (async () => {
      if (!distributionPool || !address) return;
      const accountAddress = await distributionPool.getAccountAddress(address);
      const distributionAccount = tonClient.open(
        DistributionAccount.createFromAddress(accountAddress),
      );
      setDistributionAccount(distributionAccount);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distributionPool, address?.toString()]);

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
      try {
        if (!sender.address || !distributionPool || !distributionAccount) return null;

        let totalPaid = 0n;
        try {
          const result = await distributionAccount.getAccountData();
          totalPaid = result.totalPaid;
        } catch {}

        const rewardsDictionary = await getRewardsDictionary(distributionPool);

        const value = rewardsDictionary.get(sender.address);

        console.log({ totalPaid, value });

        return value ? fromNano(value - totalPaid) : undefined;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    { refreshInterval: 5000 },
  );

  console.log({ data, error });

  return {
    balance: data,
    error,
  };
}
