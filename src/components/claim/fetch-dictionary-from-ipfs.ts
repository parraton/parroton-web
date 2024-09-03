import { DictionaryUtils } from '@components/claim/dictionary';
import { IPFS_GATEWAY } from '@config/api.config';

export const fetchDictionaryFromIpfs = async (dataUri: string) => {
  const url = `${IPFS_GATEWAY}/${dataUri.replace('ipfs://', '')}`;

  const response = await fetch(url);

  const merkleTreeBOC = await response.arrayBuffer();

  const buffer = Buffer.from(merkleTreeBOC);

  return DictionaryUtils.fromBoc(buffer);
};
