import { Address, Dictionary, OpenedContract, Sender } from '@ton/core';
import { DistributionPool } from '@dedust/apiary-v1';

export async function claimDeDustDistributionRewards(
  sender: Sender,
  rewardsDictionary: Dictionary<Address, bigint>,
  distributionPool: OpenedContract<DistributionPool>,
  userAddress: Address,
) {
  const proof = rewardsDictionary.generateMerkleProof([userAddress]);
  return await distributionPool.sendClaim(sender, {
    userAddress,
    proof,
  });
}
