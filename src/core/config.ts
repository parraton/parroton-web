import mem from 'mem';
import axios, { getAdapter } from 'axios';
import { TonClient4 } from '@ton/ton';

const adapter = getAdapter(axios.defaults.adapter);
const memoizedAdapter = mem(adapter, {
  maxAge: 5000, // blocktime is 5 seconds
  cacheKey: JSON.stringify,
});

export const tonClient = new TonClient4({
  endpoint: '/api/ton-client',
  timeout: 30_000,

  httpAdapter: memoizedAdapter,
});
