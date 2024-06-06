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

export type VaultConfig = {
  distributionPoolAddress: Address;
  sharesTotalSupply: bigint;
  depositedLp: bigint;
  managementFeeRate: bigint;
  managementFee: bigint;
  depositLpWalletAddress: Address;
  adminAddress: Address;
  managerAddress: Address;
  strategyAddress: Address;
  sharesWalletCode: Cell;
  tempUpgrade: Cell;
};

export function vaultConfigToCell(config: VaultConfig): Cell {
  return beginCell()
    .storeAddress(config.distributionPoolAddress)
    .storeCoins(config.sharesTotalSupply)
    .storeCoins(config.depositedLp)
    .storeCoins(config.managementFeeRate)
    .storeCoins(config.managementFee)
    .storeAddress(config.depositLpWalletAddress)
    .storeRef(
      beginCell()
        .storeAddress(config.adminAddress)
        .storeAddress(config.managerAddress)
        .storeAddress(config.strategyAddress)
        .endCell(),
    )
    .storeRef(config.sharesWalletCode)
    .storeRef(config.tempUpgrade)
    .endCell();
}

export const Opcodes = {
  deposit: 0x95_db_9d_39,
  burn_notification: 0x7b_dd_97_de,
  transfer_notification: 0x73_62_d0_9c,
  internal_transfer: 0x17_8d_45_19,
  excesses: 0xd5_32_76_db,
  transfer: 0xf_8a_7e_a5,
  set_deposit_lp_wallet_address: 0x77_19_b8_4f,
  set_strategy_address: 0xa3_d7_61_1f,
  reinvest: 0x8_12_d4_e3,
};

export class Vault implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new Vault(address);
  }

  static createFromConfig(config: VaultConfig, code: Cell, workchain = 0) {
    const data = vaultConfigToCell(config);
    const init = { code, data };
    return new Vault(contractAddress(workchain, init), init);
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    });
  }

  prepareDepositPayload() {
    return beginCell().storeUint(Opcodes.deposit, 32).endCell();
  }

  async sendDepositNotification(
    provider: ContractProvider,
    via: Sender,
    opts: {
      jettonAmount: bigint;
      fromAddress: Address;
      value: bigint;
      queryId?: number;
    },
  ) {
    const transferPayload = await this.prepareDepositPayload();

    return provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.transfer_notification, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeCoins(opts.jettonAmount)
        .storeAddress(opts.fromAddress)
        .storeBit(true)
        .storeRef(transferPayload)
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

  async sendReinvest(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      totalReward: bigint;
      amountToSwap: bigint;
      limit: bigint;
      tonTargetBalance: bigint;
      depositFee: bigint;
      depositFwdFee: bigint;
      transferFee: bigint;
      jettonTargetBalance: bigint;
      deadline: number;
      queryId?: number;
    },
  ) {
    return provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.reinvest, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeCoins(opts.totalReward)
        .storeRef(
          beginCell()
            .storeCoins(opts.amountToSwap)
            .storeCoins(opts.limit)
            .storeUint(opts.deadline, 32)
            .storeCoins(opts.tonTargetBalance)
            .storeCoins(opts.jettonTargetBalance)
            .storeCoins(opts.depositFee)
            .storeCoins(opts.depositFwdFee)
            .storeCoins(opts.transferFee)
            .endCell(),
        )
        .endCell(),
    });
  }

  async sendSetStrategyAddress(
    provider: ContractProvider,
    via: Sender,
    opts: {
      value: bigint;
      strategyAddress: Address;
      queryId?: number;
    },
  ) {
    return provider.internal(via, {
      value: opts.value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell()
        .storeUint(Opcodes.set_strategy_address, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeAddress(opts.strategyAddress)
        .endCell(),
    });
  }

  async getVaultData(provider: ContractProvider): Promise<VaultConfig> {
    const result = await provider.get('get_vault_data', []);
    return {
      distributionPoolAddress: result.stack.readAddress(),
      sharesTotalSupply: result.stack.readBigNumber(),
      depositedLp: result.stack.readBigNumber(),
      managementFeeRate: result.stack.readBigNumber(),
      managementFee: result.stack.readBigNumber(),
      depositLpWalletAddress: result.stack.readAddress(),
      adminAddress: result.stack.readAddress(),
      managerAddress: result.stack.readAddress(),
      strategyAddress: result.stack.readAddress(),
      sharesWalletCode: result.stack.readCell(),
      tempUpgrade: result.stack.readCell(),
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
