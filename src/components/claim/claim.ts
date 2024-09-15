import { Sender } from '@utils/sender';
import { DistributionPool } from '@dedust/apiary-v1';
import { Address, OpenedContract } from '@ton/core';
import { claimDeDustDistributionRewards } from './claim-de-dust-distribution-rewards';
import { fetchDictionaryFromIpfs } from '@components/claim/fetch-dictionary-from-ipfs';
import { getVaultDistributionPool } from '@hooks/use-vault-distribution-pool';

export const getRewardsDictionary = async (distributionPool: OpenedContract<DistributionPool>) => {
  const { dataUri } = await distributionPool.getRewardsData();

  if (!dataUri) {
    throw new Error('Data URI is not defined');
  }

  return await fetchDictionaryFromIpfs(dataUri);
};

const claimRewards = async (
  sender: Sender,
  distributionPool: OpenedContract<DistributionPool>,
  userAddress: Address,
) => {
  const rewardsDictionary = await getRewardsDictionary(distributionPool);

  await claimDeDustDistributionRewards(sender, rewardsDictionary, distributionPool, userAddress);
};

export const claim = async (sender: Sender, vaultAddress: Address) => {
  if (!sender.address) {
    throw new Error('Sender address is not defined');
  }

  const distributionPool = getVaultDistributionPool(vaultAddress.toString());

  await claimRewards(sender, distributionPool, sender.address);
};
