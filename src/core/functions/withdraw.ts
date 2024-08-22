import { OpenedContract, toNano } from '@ton/core';
import { Sender } from '@utils/sender';
import { SharesWallet } from '@parraton/sdk';

export async function withdraw(
  sharesWallet: OpenedContract<SharesWallet>,
  sender: Sender,
  jettonAmount: bigint,
) {
  return await sharesWallet.sendBurn(sender, {
    value: toNano('0.1'),
    amount: jettonAmount,
    responseAddress: sender.address,
  });
}
