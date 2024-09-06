import { isMainnet } from '@lib/utils';

const testnetTonClientUrl = 'https://testnet-v4.tonhubapi.com';
const testnetTonViewerUrl = 'https://testnet.tonviewer.com';
const testnetTonApiUrl = 'https://testnet.tonapi.io';
const testnetTonCenterUrl = 'https://testnet.toncenter.com/api/v2/jsonRPC';

const mainnetTonClientUrl = 'https://mainnet-v4.tonhubapi.com';
const mainnetTonViewerUrl = 'https://tonviewer.com';
const mainnetTonApiUrl = 'https://tonapi.io';
const mainnetTonCenterUrl = 'https://toncenter.com/api/v2/jsonRPC';

const defaultVaultsApi = 'https://parraton-api-yklcg.ondigitalocean.app/v1/vaults';

export const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs';
export const TON_CLIENT_URL = isMainnet ? mainnetTonClientUrl : testnetTonClientUrl;
export const TONVIEWER_URL = isMainnet ? mainnetTonViewerUrl : testnetTonViewerUrl;
export const TONAPI_URL = isMainnet ? mainnetTonApiUrl : testnetTonApiUrl;
export const TONCENTER_URL = isMainnet ? mainnetTonCenterUrl : testnetTonCenterUrl;
export const VAULTS_API = defaultVaultsApi;
