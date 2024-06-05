import {Address} from '@ton/core';
import {TonClient4} from '@ton/ton';
import {exists} from '@core/helpers';
import {getHttpEndpoint} from '@orbs-network/ton-access';
import {addresses, usdtVault} from "@config/contracts-config";

export const POOL_ADDRESS = Address.parse(exists<string>(usdtVault.pool));
export const VAULT_ADDRESS = Address.parse(exists<string>(usdtVault.vault));
export const TOKEN_ADDRESS = Address.parse(exists<string>(usdtVault.token));
export const DEDUST_ADDRESS = Address.parse(exists<string>(addresses.dedustFactory));

export const HOLE_ADDRESS = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

// eslint-disable-next-line unicorn/prefer-top-level-await
export const tonClientPromise = (async () => {
  const endpoint = await getHttpEndpoint({
    network: 'testnet',
  });

  return new TonClient4({
    endpoint: exists<string>(process.env.NEXT_PUBLIC_TON_CLIENT_URL),
  });
})();
