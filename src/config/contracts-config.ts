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

const usdtVaultTestnet = toAddressesDict({
  vault: 'EQCczQbuj2Z5tLLt4mYb-kVgt52A9kXbkVFWSuToexwbajV_',
  extraDistributionPool: 'EQDWQ59GyQ2qxkC2_kdoOnjwfVv_3kTBA1_GQ3JG9QhkM2sq',
});

const commonAddressesTestnet = toAddressesDict({
  dedustFactory: 'EQDHcPxlCOSN_s-Vlw53bFpibNyKpZHV6xHhxGAAT_21nCFU',
});

const testnetAddresses = {
  vaults: [usdtVaultTestnet], //, scaleVault, notVault],
  ...commonAddressesTestnet,
} as const;

export const addresses = testnetAddresses;
