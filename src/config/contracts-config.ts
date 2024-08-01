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
  vault: 'EQBgdJIHy2z4YEo5ssqIOExlGDD61Tn2bIytXtNBj1pW9onM',
  extraDistributionPool: 'EQDpeKN5EPj7sSAToZlLTYppRPNDk2EQghugRKLWlBAjCvOi',
});

const scaleVault = toAddressesDict({
  vault: 'EQCQ1FiAoaZemtGd_5Nz3zJpzBqzG2RLipoBfIvOcioTLAB7',
  extraDistributionPool: 'EQAE6WdY8_uybeL_8jN1nlV-4ixTbUVbAKx--pUjs2mUQL79',
});

const notVault = toAddressesDict({
  vault: 'EQDRdHx-8fC6aW6lSlqAYwOlYo5L5nM8PNChwjxWaQHOdDVx',
  extraDistributionPool: 'EQDpkTnKu_fX_ZRotAVsA9yZTfFd35LBtLWfhO6f1Kp2-b1Z',
});

const commonAddresses = toAddressesDict({
  dedustFactory: 'EQDHcPxlCOSN_s-Vlw53bFpibNyKpZHV6xHhxGAAT_21nCFU',
  dedustDistributionFactory: 'EQC0WJSeustdSo4fI5eRXmxdu8rqyWz9tBwLmX9E94dQlUCv',
  extraRewardsDistributionFactory: 'EQDmtWKElPJLGJfjlN060ztD6-CwM_8HFNIFH507qiza-x6H',
  vaultFactory: 'EQAYiDrQ9_veYdJZGbbHF4HSUoT3YvJ5xNHmMxrJRMtwEP7s',
});

export const addresses = {
  vaults: [usdtVault], //, scaleVault, notVault],
  ...commonAddresses,
} as const;
