const testnetTonClientUrl = 'https://testnet-v4.tonhubapi.com';
const testnetTonViewerUrl = 'https://testnet.tonviewer.com';
const testnetTonApiUrl = 'https://testnet.tonapi.io';
const testnetTonCenterUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC';

const mainnetTonClientUrl = 'https://mainnet-v4.tonhubapi.com';
const mainnetTonViewerUrl = 'https://tonviewer.com';
const mainnetTonApiUrl = 'https://tonapi.io';
const mainnetTonCenterUrl = 'https://toncenter.com/api/v2/jsonRPC';

const network = process.env.NETWORK;

export const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';
export const TON_CLIENT_URL = network === 'testnet' ? testnetTonClientUrl : mainnetTonClientUrl;
export const TONVIEWER_URL = network === 'testnet' ? testnetTonViewerUrl : mainnetTonViewerUrl;
export const TONAPI_URL = network === 'testnet' ? testnetTonApiUrl : mainnetTonApiUrl;
export const TONCENTER_URL = network === 'testnet' ? testnetTonCenterUrl : mainnetTonCenterUrl;
