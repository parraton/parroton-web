import {Address, Cell, Contract, ContractProvider} from "@ton/core";
import {SendTransactionResponse} from "@tonconnect/ui";
import {Sender} from "@utils/sender";
import {SwapParams, SwapStep, Vault} from "@dedust/sdk/dist/contracts/dex/vault/Vault";
import {Asset, ReadinessStatus} from "@dedust/sdk/dist/contracts/dex/common";
import {Pool, PoolType} from "@dedust/sdk/dist/contracts/dex/pool";
import {VaultJetton} from "@dedust/sdk/dist/contracts/dex/vault";
import {LiquidityDeposit} from "@dedust/sdk/dist/contracts/dex/liquidity-deposit";

declare module '@dedust/sdk' {
  export declare class JettonWallet implements Contract {
    readonly address: Address;
    static readonly TRANSFER = 260734629;
    static readonly TRANSFER_NOTIFICATION = 1935855772;
    static readonly INTERNAL_TRANSFER = 395134233;
    static readonly BURN = 1499400124;
    static readonly EXCESSES = 3576854235;

    constructor(address: Address);

    static createFromAddress(address: Address): JettonWallet;

    sendTransfer(provider: ContractProvider, via: Sender, value: bigint, {
      queryId,
      amount,
      destination,
      responseAddress,
      customPayload,
      forwardAmount,
      forwardPayload,
    }: {
      queryId?: number | bigint;
      destination: Address;
      amount: bigint;
      responseAddress?: Address | null;
      customPayload?: Cell;
      forwardAmount?: bigint;
      forwardPayload?: Cell;
    }): Promise<SendTransactionResponse>;

    sendBurn(provider: ContractProvider, via: Sender, value: bigint, {
      queryId,
      amount,
      responseAddress,
      customPayload,
    }: {
      queryId?: number | bigint;
      amount: bigint;
      responseAddress?: Address | null;
      customPayload?: Cell;
    }): Promise<SendTransactionResponse>;

    getWalletData(provider: ContractProvider): Promise<{
      balance: bigint;
      ownerAddress: Address;
      minterAddress: Address;
      walletCode: Cell;
    }>;

    getBalance(provider: ContractProvider): Promise<bigint>;
  }

  export declare class VaultNative extends Vault {
    readonly address: Address;
    static readonly DEPOSIT_LIQUIDITY = 3579725446;
    static readonly SWAP = 3926267997;

    protected constructor(address: Address);

    static createFromAddress(address: Address): VaultNative;

    getReadinessStatus(provider: ContractProvider): Promise<ReadinessStatus>;

    sendDepositLiquidity(provider: ContractProvider, via: Sender, {
      queryId,
      amount,
      poolType,
      assets,
      minimalLPAmount,
      targetBalances,
      fulfillPayload,
      rejectPayload,
    }: {
      queryId?: bigint | number;
      amount: bigint;
      poolType: PoolType;
      assets: [Asset, Asset];
      minimalLPAmount?: bigint;
      targetBalances: [bigint, bigint];
      fulfillPayload?: Cell | null;
      rejectPayload?: Cell | null;
    }): Promise<SendTransactionResponse>;

    sendSwap(provider: ContractProvider, via: Sender, {
      queryId,
      amount,
      poolAddress,
      limit,
      swapParams,
      next,
      gasAmount,
    }: {
      queryId?: bigint | number;
      amount: bigint;
      poolAddress: Address;
      limit?: bigint;
      swapParams?: SwapParams;
      next?: SwapStep;
      gasAmount?: bigint;
    }): Promise<SendTransactionResponse>;
  }

  export declare class Factory implements Contract {
    readonly address: Address;
    static readonly CREATE_VAULT = 567271467;
    static readonly CREATE_VOLATILE_POOL = 2547326767;

    protected constructor(address: Address);

    static createFromAddress(address: Address): Factory;

    sendCreateVault(provider: ContractProvider, via: Sender, {queryId, asset}: {
      queryId?: number | bigint;
      asset: Asset;
    }): Promise<SendTransactionResponse>;

    getVaultAddress(provider: ContractProvider, asset: Asset): Promise<Address>;

    getNativeVault(provider: ContractProvider): Promise<VaultNative>;

    getJettonVault(provider: ContractProvider, jettonRoot: Address): Promise<VaultJetton>;

    sendCreateVolatilePool(provider: ContractProvider, via: Sender, {queryId, assets}: {
      queryId?: number | bigint;
      assets: [Asset, Asset];
    }): Promise<SendTransactionResponse>;

    getPoolAddress(provider: ContractProvider, {poolType, assets,}: {
      poolType: PoolType;
      assets: [Asset, Asset];
    }): Promise<Address>;

    getPool(provider: ContractProvider, poolType: PoolType, assets: [Asset, Asset]): Promise<Pool>;

    getLiquidityDepositAddress(provider: ContractProvider, {ownerAddress, poolType, assets,}: {
      ownerAddress: Address;
      poolType: PoolType;
      assets: [Asset, Asset];
    }): Promise<Address>;

    getLiquidityDeposit(provider: ContractProvider, {ownerAddress, poolType, assets,}: {
      ownerAddress: Address;
      poolType: PoolType;
      assets: [Asset, Asset];
    }): Promise<LiquidityDeposit>;
  }

  export declare class JettonRoot implements Contract {
    readonly address: Address;

    private constructor();

    static createFromAddress(address: Address): JettonRoot;

    getWalletAddress(provider: ContractProvider, ownerAddress: Address): Promise<Address>;

    getWallet(provider: ContractProvider, ownerAddress: Address): Promise<JettonWallet>;

    getJettonData(provider: ContractProvider): Promise<{
      totalSupply: bigint;
      isMintable: boolean;
      adminAddress: Address | null;
      content: Cell;
      walletCode: Cell;
    }>;
  }

  export declare class JettonWallet implements Contract {
    readonly address: Address;
    static readonly TRANSFER = 260734629;
    static readonly TRANSFER_NOTIFICATION = 1935855772;
    static readonly INTERNAL_TRANSFER = 395134233;
    static readonly BURN = 1499400124;
    static readonly EXCESSES = 3576854235;

    constructor(address: Address);

    static createFromAddress(address: Address): JettonWallet;

    sendTransfer(provider: ContractProvider, via: Sender, value: bigint, {
      queryId,
      amount,
      destination,
      responseAddress,
      customPayload,
      forwardAmount,
      forwardPayload,
    }: {
      queryId?: number | bigint;
      destination: Address;
      amount: bigint;
      responseAddress?: Address | null;
      customPayload?: Cell;
      forwardAmount?: bigint;
      forwardPayload?: Cell;
    }): Promise<SendTransactionResponse>;

    sendBurn(provider: ContractProvider, via: Sender, value: bigint, {
      queryId,
      amount,
      responseAddress,
      customPayload,
    }: {
      queryId?: number | bigint;
      amount: bigint;
      responseAddress?: Address | null;
      customPayload?: Cell;
    }): Promise<SendTransactionResponse>;

    getWalletData(provider: ContractProvider): Promise<{
      balance: bigint;
      ownerAddress: Address;
      minterAddress: Address;
      walletCode: Cell;
    }>;

    getBalance(provider: ContractProvider): Promise<bigint>;
  }
}