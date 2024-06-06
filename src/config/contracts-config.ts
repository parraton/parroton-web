import { Address } from '@ton/core';

type AddressDict<T extends Record<string, string>> = {
  [K in keyof T]: Address;
};

const toAddressesDict = <T extends Record<string, string>>(rawAddresses: T): AddressDict<T> => {
  return Object.fromEntries(
    Object.entries(rawAddresses).map(([key, value]) => [key, Address.parse(value)] as const),
  ) as AddressDict<T>;
};

const usdtVault = toAddressesDict({
  vault: 'EQDCTVjdnkcr5yIyBJBKLdGtiSuDYYhZCQD6ZwqSPWeMP4Mi',
  extraDistributionPool: 'EQBDJhFGiwHf17N4KCDgDS8GkGDeNadWzg_Ek23DN7WNAuVN',
});

const scaleVault = toAddressesDict({
  vault: 'EQCx3v_v6OTg58BDMIBIREewZ1rfFjyzbgEivXbpZGN9J6_P',
  extraDistributionPool: 'EQCG-vwexBCTFh17mU2ffwRusqkv2PbqQa1mhZt5NUtMhCZt',
});

const notVault = toAddressesDict({
  vault: 'EQDzgLurE_klqVvHAdyZ1hBGQpgHCiDFpRg4bnu_-DUyxX4g',
  extraDistributionPool: 'EQA-Nx5mMcP8_BXlh6qJ_oLsFPguCsoa0Pn4Nbg6cI3SNE-8',
});

const commonAddresses = toAddressesDict({
  dedustFactory: 'EQDHcPxlCOSN_s-Vlw53bFpibNyKpZHV6xHhxGAAT_21nCFU',
  dedustDistributionFactory: 'EQC0WJSeustdSo4fI5eRXmxdu8rqyWz9tBwLmX9E94dQlUCv',
  extraRewardsDistributionFactory: 'EQDmtWKElPJLGJfjlN060ztD6-CwM_8HFNIFH507qiza-x6H',
  vaultFactory: 'EQAYiDrQ9_veYdJZGbbHF4HSUoT3YvJ5xNHmMxrJRMtwEP7s',
});

export const addresses = {
  vaults: [usdtVault, scaleVault, notVault],
  ...commonAddresses,
} as const;
