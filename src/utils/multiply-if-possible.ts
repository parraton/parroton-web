import BigNumber from 'bignumber.js';

export const multiplyIfPossible = (
  a: number | string | null | undefined,
  b: number | string | null | undefined,
): string | undefined => {
  if (a === null || a === undefined || b === null || b === undefined) {
    return undefined;
  }

  const aNumber = new BigNumber(a);
  const bNumber = new BigNumber(b);

  if (aNumber.isNaN() || bNumber.isNaN()) {
    return undefined;
  }

  return aNumber.times(bNumber).toString();
};
