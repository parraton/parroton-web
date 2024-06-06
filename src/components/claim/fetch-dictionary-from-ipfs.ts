import { DictionaryUtils } from '@components/claim/dictionary';

export const fetchDictionaryFromIpfs = async (dataUri: string) => {
  const url = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/${dataUri.replace('ipfs://', '')}`;

  const response = await fetch(url);

  const merkleTreeBOC = await response.arrayBuffer();

  const buffer = Buffer.from(merkleTreeBOC);

  return DictionaryUtils.fromBoc(buffer);
};
