import { Address, beginCell, Cell, Dictionary } from '@ton/core';

export class DictionaryUtils {
  static fromBoc(buffer: Buffer) {
    return Cell.fromBoc(buffer)[0]
      .beginParse()
      .loadDictDirect(Dictionary.Keys.Address(), Dictionary.Values.BigVarUint(4));
  }

  static toBoc(dictionary: Dictionary<Address, bigint>) {
    return beginCell().storeDictDirect(dictionary).endCell().toBoc();
  }
}
