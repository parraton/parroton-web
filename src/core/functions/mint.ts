import { toNano, Address } from '@ton/core';
import { prepareJettonMintBody } from '@core/messages/jetton-mint.body';
import { Message } from '../../types/message.type';

export function mint(
  jettonAddress: Address,
  receiverAddress: Address,
  jettonAmount: bigint,
): Message {
  const jettonMintBody = prepareJettonMintBody({
    receiver: receiverAddress,
    amount: jettonAmount,
  });
  return {
    address: jettonAddress.toRawString(),
    amount: toNano('0.05').toString(),
    payload: jettonMintBody.toBoc().toString('base64'),
  };
}
