import { Address, beginCell, Cell } from '@ton/ton';

// eslint-disable-next-line unicorn/numeric-separators-style
export const TRANSFER_OP_CODE = 0xf8a7ea5;

export function prepareJettonTransferBody({
  queryId,
  amount,
  destination,
  responseAddress,
  customPayload,
  forwardAmount,
  forwardPayload,
}: {
  queryId?: number | bigint;
  destination: Address;
  amount: bigint;
  responseAddress?: Address | null;
  customPayload?: Cell;
  forwardAmount?: bigint;
  forwardPayload?: Cell;
}) {
  return beginCell()
    .storeUint(TRANSFER_OP_CODE, 32)
    .storeUint(queryId ?? 0, 64)
    .storeCoins(amount)
    .storeAddress(destination)
    .storeAddress(responseAddress)
    .storeMaybeRef(customPayload)
    .storeCoins(forwardAmount ?? 0)
    .storeMaybeRef(forwardPayload)
    .endCell();
}
