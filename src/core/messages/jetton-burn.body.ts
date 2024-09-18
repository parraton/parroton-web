import { Address, beginCell, Cell } from '@ton/ton';

// eslint-disable-next-line unicorn/numeric-separators-style
export const BURN_OP_CODE = 0x595f07bc;

export function prepareJettonBurnBody({
  queryId,
  amount,
  responseAddress,
  customPayload,
}: {
  queryId?: number | bigint;
  amount: bigint;
  responseAddress?: Address | null;
  customPayload?: Cell;
}) {
  return beginCell()
    .storeUint(BURN_OP_CODE, 32)
    .storeUint(queryId ?? 0, 64)
    .storeCoins(amount)
    .storeAddress(responseAddress)
    .storeMaybeRef(customPayload)
    .endCell();
}
