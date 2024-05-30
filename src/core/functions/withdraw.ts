import { OpenedContract, Sender, toNano } from '@ton/core';
import { SharesWallet } from '@core/contracts/shares-wallet';

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
