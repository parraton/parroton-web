import { Asset, PoolType } from '@dedust/sdk';
import { beginCell, Cell } from '@ton/ton';

// eslint-disable-next-line unicorn/numeric-separators-style
export const DEPOSIT_LIQUIDITY_OP_CODE = 0xd55e4686;

export function prepareDedustDepositTonBody({
  queryId,
  amount,
  poolType,
  assets,
  minimalLPAmount,
  targetBalances,
  fulfillPayload,
  rejectPayload,
}: {
  queryId?: bigint | number;
  amount: bigint;
  poolType: PoolType;
  assets: [Asset, Asset];
  minimalLPAmount?: bigint;
  targetBalances: [bigint, bigint];
  fulfillPayload?: Cell | null;
  rejectPayload?: Cell | null;
}) {
  return beginCell()
    .storeUint(DEPOSIT_LIQUIDITY_OP_CODE, 32)
    .storeUint(queryId ?? 0, 64)
    .storeCoins(amount)
    .storeUint(poolType, 1)
    .storeSlice(assets[0].toSlice())
    .storeSlice(assets[1].toSlice())
    .storeRef(
      beginCell()
        .storeCoins(minimalLPAmount ?? 0)
        .storeCoins(targetBalances[0])
        .storeCoins(targetBalances[1])
        .endCell(),
    )
    .storeMaybeRef(fulfillPayload)
    .storeMaybeRef(rejectPayload)
    .endCell();
}
