import { toNano, Address, Sender, OpenedContract } from '@ton/core';
import { JettonMinter } from '@core/contracts/jetton-minter';

export async function mint(
  jettonMinter: OpenedContract<JettonMinter>,
  sender: Sender,
  receiverAddress: Address,
  jettonAmount: bigint,
) {
  return await jettonMinter.sendMint(sender, {
    value: toNano('0.05'),
    receiver: receiverAddress,
    amount: jettonAmount,
  });
}
