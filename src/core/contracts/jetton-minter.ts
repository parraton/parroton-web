/* eslint-disable no-unused-vars */
import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from '@ton/core';

export type JettonMinterConfig = {
  totalSupply: bigint;
  adminAddress: Address;
  content: Cell;
  jettonWalletCode: Cell;
};

export type JettonMinterData = {
  totalSupply: bigint;
  mintable: boolean;
  adminAddress: Address;
  content: Cell;
  jettonWalletCode: Cell;
};

export function testJettonMinterConfigToCell(config: JettonMinterConfig): Cell {
  return beginCell()
    .storeCoins(config.totalSupply)
    .storeAddress(config.adminAddress)
    .storeRef(config.content)
    .storeRef(config.jettonWalletCode)
    .endCell();
}

export const Opcodes = {
  mint: 0x3_18_f3_61,
};

export class JettonMinter implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new JettonMinter(address);
  }

  static createFromConfig(config: JettonMinterConfig, code: Cell, workchain = 0) {
    const data = testJettonMinterConfigToCell(config);
    const init = { code, data };
    return new JettonMinter(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendMint(
    provider: ContractProvider,
    via: Sender,
    opts: {
      receiver: Address;
      amount: bigint;
      value: bigint;
      queryId?: number;
    },
  ) {
    return await provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.mint, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeAddress(opts.receiver)
        .storeCoins(opts.amount)
        .endCell(),
    });
  }

  async getJettonData(provider: ContractProvider): Promise<JettonMinterData> {
    const result = await provider.get('get_jetton_data', []);
    return {
      totalSupply: result.stack.readBigNumber(),
      mintable: result.stack.readBoolean(),
      adminAddress: result.stack.readAddress(),
      content: result.stack.readCell(),
      jettonWalletCode: result.stack.readCell(),
    };
  }

  async getWalletAddress(provider: ContractProvider, ownerAddress: Address): Promise<Address> {
    const result = await provider.get('get_wallet_address', [
      {
        type: 'slice',
        cell: beginCell().storeAddress(ownerAddress).endCell(),
      },
    ]);
    return result.stack.readAddress();
  }
}
