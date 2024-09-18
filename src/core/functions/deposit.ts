import { Address, OpenedContract, toNano } from '@ton/core';
import { Vault } from '@parraton/sdk';
import { prepareJettonTransferBody } from '@core/messages/jetton-transfer.body';
import { Message } from '../../types/message.type';

export function deposit(
  investorLpWalletAddress: Address,
  vault: OpenedContract<Vault>,
  atomicJettonAmount: bigint,
  referralAddress?: string | null,
): Message {
  const jettonTransferBody = prepareJettonTransferBody({
    destination: vault.address,
    amount: atomicJettonAmount,
    // DEV: should ve change to sender's address?
    responseAddress: vault.address,
    forwardAmount: toNano('0.05'),
    forwardPayload: vault.prepareDepositPayload({
      referralAddress: referralAddress ? Address.parse(referralAddress) : undefined,
    }),
  });
  return {
    address: investorLpWalletAddress.toRawString(),
    amount: toNano('0.1').toString(),
    payload: jettonTransferBody.toBoc().toString('base64'),
  };
}
