import { Address, beginCell } from '@ton/ton';

// eslint-disable-next-line unicorn/numeric-separators-style
export const MINT_OP_CODE = 0x595f07bc;

export function prepareJettonMintBody({
  queryId,
  amount,
  receiver,
}: {
  queryId?: number | bigint;
  amount: bigint;
  receiver: Address;
}) {
  return beginCell()
    .storeUint(MINT_OP_CODE, 32)
    .storeUint(queryId ?? 0, 64)
    .storeAddress(receiver)
    .storeCoins(amount)
    .endCell();
}
