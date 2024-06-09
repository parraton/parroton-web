import { Address } from '@ton/core';
import { TonClient4 } from '@ton/ton';
import { exists } from '@core/helpers';

export const HOLE_ADDRESS = Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

export const tonClient = new TonClient4({
  endpoint: exists<string>('/api/ton-client'),
});
