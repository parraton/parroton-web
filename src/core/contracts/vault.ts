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
  sharesTotalSupply: bigint;
  depositedLp: bigint;
  token0Balance: bigint;
  token1Balance: bigint;
  poolType: number;
  adminAddress: Address;
  depositLpWalletAddress: Address;
  token0WalletAddress: Address;
  token1WalletAddress: Address;
  // referral: Address;
  sharesWalletCode: Cell;
  tempUpgrade: Cell;
};

export function vaultConfigToCell(config: VaultConfig): Cell {
  return beginCell()
    .storeCoins(config.sharesTotalSupply)
    .storeCoins(config.depositedLp)
    .storeCoins(config.token0Balance)
    .storeCoins(config.token1Balance)
    .storeUint(config.poolType, 1)
    .storeAddress(config.adminAddress)
    .storeRef(
      beginCell()
        .storeAddress(config.depositLpWalletAddress)
        .storeAddress(config.token0WalletAddress)
        .storeAddress(config.token1WalletAddress)
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
  set_token_0_wallet_address: 0x71_49_c6_91,
  set_token_1_wallet_address: 0xdf_21_57_00,
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

  async sendSetToken0WalletAddress(
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
        .storeUint(Opcodes.set_token_0_wallet_address, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeAddress(opts.walletAddress)
        .endCell(),
    });
  }

  async sendSetToken1WalletAddress(
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
        .storeUint(Opcodes.set_token_1_wallet_address, 32)
        .storeUint(opts.queryId ?? 0, 64)
        .storeAddress(opts.walletAddress)
        .endCell(),
    });
  }

  async getVaultData(provider: ContractProvider): Promise<VaultConfig> {
    const result = await provider.get('get_vault_data', []);
    return {
      sharesTotalSupply: result.stack.readBigNumber(),
      depositedLp: result.stack.readBigNumber(),
      token0Balance: result.stack.readBigNumber(),
      token1Balance: result.stack.readBigNumber(),
      poolType: result.stack.readNumber(),
      adminAddress: result.stack.readAddress(),
      depositLpWalletAddress: result.stack.readAddress(),
      token0WalletAddress: result.stack.readAddress(),
      token1WalletAddress: result.stack.readAddress(),
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
