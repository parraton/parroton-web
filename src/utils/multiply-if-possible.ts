export const multiplyIfPossible = (
  a: number | string | null | undefined,
  b: number | string | null | undefined,
): number | undefined => {
  if (a === null || a === undefined || b === null || b === undefined) {
    return undefined;
  }

  const aNumber = Number(a);
  const bNumber = Number(b);

  if (Number.isNaN(aNumber) || Number.isNaN(bNumber)) {
    return undefined;
  }

  return aNumber * bNumber;
};
