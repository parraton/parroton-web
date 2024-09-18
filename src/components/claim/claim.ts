import { DistributionPool } from '@dedust/apiary-v1';
import { OpenedContract } from '@ton/core';
import { fetchDictionaryFromIpfs } from '@components/claim/fetch-dictionary-from-ipfs';

export const getRewardsDictionary = async (distributionPool: OpenedContract<DistributionPool>) => {
  const { dataUri } = await distributionPool.getRewardsData();

  if (!dataUri) {
    throw new Error('Data URI is not defined');
  }

  return await fetchDictionaryFromIpfs(dataUri);
};
