const PERCENTAGE = 100;

export const calculateApy = (apr: number, numberOfPeriods: number) => {
  const aprOnPeriod = apr / PERCENTAGE / numberOfPeriods;

  const BASE = 1;

  return ((BASE + aprOnPeriod) ** numberOfPeriods - BASE) * PERCENTAGE;
};
