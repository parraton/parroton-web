import {Address} from '@ton/core';
import {TonClient4} from '@ton/ton';
import {exists} from '@core/helpers';
import {getHttpEndpoint} from '@orbs-network/ton-access';

export const POOL_ADDRESS = Address.parse(
  exists<string>(process.env.NEXT_PUBLIC_TEST_TOKEN_LP_ADDRESS),
);
export const VAULT_ADDRESS = Address.parse(exists<string>(process.env.NEXT_PUBLIC_VAULT_ADDRESS));
export const TOKEN_ADDRESS = Address.parse(
  exists<string>(process.env.NEXT_PUBLIC_TEST_TOKEN_ADDRESS),
);
export const DEDUST_ADDRESS = Address.parse(
  exists<string>(process.env.NEXT_PUBLIC_DEDUST_FACTORY_ADDRESS),
);

export const HOLE_ADDRESS = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

// eslint-disable-next-line unicorn/prefer-top-level-await
export const tonClientPromise = (async () => {
  const endpoint = await getHttpEndpoint({
    network: 'testnet',
  });

  return new TonClient4({
    endpoint: exists<string>(process.env.NEXT_PUBLIC_TON_CLIENT_ENDPOINT),
  });
})();
