/* eslint-disable */
import {
  Address,
  beginCell,
  Cell,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';
import {Factory} from '@dedust/sdk';

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

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }
}
