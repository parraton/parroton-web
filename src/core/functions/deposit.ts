import { OpenedContract, toNano } from '@ton/core';
import { JettonWallet } from '@dedust/sdk';
import { Sender } from '@utils/sender';
import { Vault } from '@parraton/sdk';

export async function deposit(
  investorLpWallet: OpenedContract<JettonWallet>,
  vault: OpenedContract<Vault>,
  sender: Sender,
  atomicJettonAmount: bigint,
) {
  return await investorLpWallet.sendTransfer(sender, toNano('0.1'), {
    destination: vault.address,
    amount: atomicJettonAmount,
    responseAddress: vault.address,
    forwardAmount: toNano('0.05'),
    forwardPayload: vault.prepareDepositPayload(),
  });
}
