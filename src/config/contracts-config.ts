import { Address } from '@ton/core';
import { isMainnet } from '@lib/utils';

type AddressDict<T extends Record<string, string>> = {
  // eslint-disable-next-line no-unused-vars
  [K in keyof T]: Address;
};

const toAddressesDict = <T extends Record<string, string>>(rawAddresses: T): AddressDict<T> => {
  return Object.fromEntries(
    Object.entries(rawAddresses).map(([key, value]) => [key, Address.parse(value)] as const),
  ) as AddressDict<T>;
};

const tonUsdtVaultTestnet = toAddressesDict({
  vault: 'EQCczQbuj2Z5tLLt4mYb-kVgt52A9kXbkVFWSuToexwbajV_',
  extraDistributionPool: 'EQDWQ59GyQ2qxkC2_kdoOnjwfVv_3kTBA1_GQ3JG9QhkM2sq',
});

const sttonUsdtVaultTestnet = toAddressesDict({
  vault: 'EQBtfvTWugSCJZqqsM5wWlYBCcAaWmwOUVEs7i7j8mAn0hZ0',
  extraDistributionPool: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
});

const commonAddressesTestnet = toAddressesDict({
  dedustFactory: 'EQDHcPxlCOSN_s-Vlw53bFpibNyKpZHV6xHhxGAAT_21nCFU',
});

const testnetAddresses = {
  vaults: [tonUsdtVaultTestnet, sttonUsdtVaultTestnet],
  ...commonAddressesTestnet,
} as const;

const usdtVaultMainnet = toAddressesDict({
  vault: 'EQC7MJVHpoi46zKJOKV2XLmYM00s6ittxRFAb4J0-20iIEMX',
  extraDistributionPool: 'EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c',
});

const commonAddressesMainnet = toAddressesDict({
  dedustFactory: 'EQBfBWT7X2BHg9tXAxzhz2aKiNTU1tpt5NsiK0uSDW_YAJ67',
});

const mainnetAddresses = {
  vaults: [usdtVaultMainnet],
  ...commonAddressesMainnet,
} as const;

export const addresses = isMainnet ? mainnetAddresses : testnetAddresses;
