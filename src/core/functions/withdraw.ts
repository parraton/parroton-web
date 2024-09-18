import { Address, toNano } from '@ton/core';
import { prepareJettonBurnBody } from '@core/messages/jetton-burn.body';
import { Message } from '../../types/message.type';

export function withdraw(
  sharesWalletAddress: Address,
  senderAddress: Address,
  jettonAmount: bigint,
): Message {
  const jettonBurnBody = prepareJettonBurnBody({
    amount: jettonAmount,
    responseAddress: senderAddress,
  });
  return {
    address: sharesWalletAddress.toRawString(),
    amount: toNano('0.1').toString(),
    payload: jettonBurnBody.toBoc().toString('base64'),
  };
}
