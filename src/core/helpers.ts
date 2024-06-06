import { Address, OpenedContract } from '@ton/core';
import { SharesWallet, Vault } from '@core/contracts';
import { tonClient } from '@core/config';
import { JettonRoot, JettonWallet } from '@dedust/sdk';
import { Strategy } from '@core/contracts/strategy';

export function exists<T>(value: T | null | undefined | unknown): T {
  if (value == undefined) {
    throw new Error('Value does not exist');
  }
  return value as T;
}

export const getSharesWallet = async (vault: OpenedContract<Vault>, sender: Address) => {
  const rawWalletAddress = await vault.getWalletAddress(sender);

  const rawSharesWallet = SharesWallet.createFromAddress(rawWalletAddress);

  return tonClient.open(rawSharesWallet);
};

export const getVault = async (vaultAddress: Address) => {
  const rawVault = Vault.createFromAddress(vaultAddress);
  return tonClient.open(rawVault);
};

export const getLpWallet = async (
  senderAddress: Address,
  poolAddress: Address,
): Promise<OpenedContract<JettonWallet>> => {
  const rawPool = JettonRoot.createFromAddress(poolAddress);

  const jettonRoot = tonClient.open(rawPool);

  const rawLpWallet = await jettonRoot.getWallet(senderAddress);
  return tonClient.open(rawLpWallet);
};

export const getStrategyInfoByVault = async (vaultAddress: Address) => {
  const rawVault = Vault.createFromAddress(vaultAddress);
  const vault = tonClient.open(rawVault);

  const { strategyAddress } = await vault.getVaultData();
  const rawStrategy = Strategy.createFromAddress(strategyAddress);
  const strategy = tonClient.open(rawStrategy);

  return await strategy.getStrategyData();
};
