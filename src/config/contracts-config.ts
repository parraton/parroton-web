import { Address } from '@ton/core';

type AddressDict<T extends Record<string, string>> = {
  // eslint-disable-next-line no-unused-vars
  [K in keyof T]: Address;
};

const toAddressesDict = <T extends Record<string, string>>(rawAddresses: T): AddressDict<T> => {
  return Object.fromEntries(
    Object.entries(rawAddresses).map(([key, value]) => [key, Address.parse(value)] as const),
  ) as AddressDict<T>;
};

const usdtVault = toAddressesDict({
  vault: 'EQA7Xhpa6ees-6ojaJyVleW_4SCPd6a28AzzTpGxdAyH2DjY',
  extraDistributionPool: 'EQA3J1fOT97Shq86vaSAd8k3QMphnsUelFkAE38CVxfTp1RJ',
});

// const scaleVault = toAddressesDict({
//   vault: 'EQCQ1FiAoaZemtGd_5Nz3zJpzBqzG2RLipoBfIvOcioTLAB7',
//   extraDistributionPool: 'EQAE6WdY8_uybeL_8jN1nlV-4ixTbUVbAKx--pUjs2mUQL79',
// });
//
// const notVault = toAddressesDict({
//   vault: 'EQDRdHx-8fC6aW6lSlqAYwOlYo5L5nM8PNChwjxWaQHOdDVx',
//   extraDistributionPool: 'EQDpkTnKu_fX_ZRotAVsA9yZTfFd35LBtLWfhO6f1Kp2-b1Z',
// });

const commonAddresses = toAddressesDict({
  dedustFactory: 'EQDHcPxlCOSN_s-Vlw53bFpibNyKpZHV6xHhxGAAT_21nCFU',
  dedustDistributionFactory: 'EQC0WJSeustdSo4fI5eRXmxdu8rqyWz9tBwLmX9E94dQlUCv',
  extraRewardsDistributionFactory: 'EQDmtWKElPJLGJfjlN060ztD6-CwM_8HFNIFH507qiza-x6H',
  vaultFactory: 'EQBilFt7vW_l_6zMv7ABE6iW8v78bLZcJlfxgZ1-RnpI6B7X',
});

export const addresses = {
  vaults: [usdtVault], //, scaleVault, notVault],
  ...commonAddresses,
} as const;
