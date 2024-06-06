import { OpenedContract, toNano } from '@ton/core';
import { JettonWallet } from '@dedust/sdk';
import { Vault } from '../contracts/vault';
import { Sender } from '@utils/sender';

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
