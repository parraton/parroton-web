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

export type StrategyConfig = {
  vaultAddress: Address;
  jettonMasterAddress: Address;
  poolAddress: Address;
  poolType: number;
  depositLpWalletAddress: Address;
  jettonWalletAddress: Address;
  adminAddress: Address;
  jettonVaultAddress: Address;
  nativeVaultAddress: Address;
  tempUpgrade: Cell;
};

export function tonJettonTonStrategyConfigToCell(config: StrategyConfig): Cell {
  return beginCell()
    .storeAddress(config.vaultAddress)
    .storeAddress(config.jettonMasterAddress)
    .storeAddress(config.poolAddress)
    .storeUint(config.poolType, 1)
    .storeRef(
      beginCell()
        .storeAddress(config.depositLpWalletAddress)
        .storeAddress(config.jettonWalletAddress)
        .storeAddress(config.adminAddress)
        .endCell(),
    )
    .storeRef(
      beginCell()
        .storeAddress(config.jettonVaultAddress)
        .storeAddress(config.nativeVaultAddress)
        .endCell(),
    )
    .storeRef(config.tempUpgrade)
    .endCell();
}

export const Opcodes = {
  transfer_notification: 0x73_62_d0_9c,
  internal_transfer: 0x17_8d_45_19,
  excesses: 0xd5_32_76_db,
  transfer: 0xf_8a_7e_a5,
  set_deposit_lp_wallet_address: 0x77_19_b8_4f,
  set_jetton_wallet_address: 0x28_8b_52_23,
  reinvest: 0x8_12_d4_e3,
};

export class Strategy implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new Strategy(address);
  }

  static createFromConfig(config: StrategyConfig, code: Cell, workchain = 0) {
    const data = tonJettonTonStrategyConfigToCell(config);
    const init = { code, data };
    return new Strategy(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  async sendReinvest(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      totalReward: bigint;
      amountToSwap: bigint;
      limit: bigint;
      tonTargetBalance: bigint;
      jettonTargetBalance: bigint;
      deadline: number;
      queryId?: number;
    },
  ) {
    return provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeCoins(opts.totalReward)
        .storeRef(
          beginCell()
            .storeUint(Opcodes.reinvest, 32)
            .storeUint(opts.queryId ?? 0, 64)
            .storeCoins(opts.amountToSwap)
            .storeCoins(opts.limit)
            .storeUint(opts.deadline, 32)
            .storeCoins(opts.tonTargetBalance)
            .storeCoins(opts.jettonTargetBalance)
            .endCell(),
        )
        .endCell(),
    });
  }

  async sendSetJettonWalletAddress(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      walletAddress: Address;
      queryId?: number;
    },
  ) {
    return provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.set_jetton_wallet_address, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeAddress(opts.walletAddress)
        .endCell(),
    });
  }

  async sendSetDepositLpWalletAddress(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      walletAddress: Address;
      queryId?: number;
    },
  ) {
    return provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.set_deposit_lp_wallet_address, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeAddress(opts.walletAddress)
        .endCell(),
    });
  }

  async getStrategyData(provider: ContractProvider): Promise<StrategyConfig> {
    const result = await provider.get('get_strategy_data', []);
    return {
      vaultAddress: result.stack.readAddress(),
      jettonMasterAddress: result.stack.readAddress(),
      poolAddress: result.stack.readAddress(),
      poolType: result.stack.readNumber(),
      depositLpWalletAddress: result.stack.readAddress(),
      jettonWalletAddress: result.stack.readAddress(),
      adminAddress: result.stack.readAddress(),
      jettonVaultAddress: result.stack.readAddress(),
      nativeVaultAddress: result.stack.readAddress(),
      tempUpgrade: result.stack.readCell(),
    };
  }
}
