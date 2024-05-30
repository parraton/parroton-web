import {
  Address,
  beginCell,
  Cell,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';
import DeDustFactoryStorage from '../assets/DeDustFactory.storage.json';
import { Factory } from '@dedust/sdk';

export type DeDustFactoryConfig = {};

export function deDustFactoryConfigToCell(config: DeDustFactoryConfig): Cell {
  return Cell.fromBase64(DeDustFactoryStorage.base64);
}

export class DeDustFactory extends Factory {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {
    super(address);
  }

  static createFromAddress(address: Address) {
    return new DeDustFactory(address);
  }

  static createFromConfig(config: DeDustFactoryConfig, code: Cell, workchain = 0) {
    const data = deDustFactoryConfigToCell(config);
    const init = { code, data };
    return new DeDustFactory(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }
}
