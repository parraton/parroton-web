import mem from 'mem';

import { Address, OpenedContract } from '@ton/core';
import { SharesWallet, Vault } from '@parraton/sdk';
import { tonClient } from '@core/config';
import { JettonRoot, JettonWallet } from '@dedust/sdk';
import { TonJettonTonStrategy } from '@parraton/sdk';

export const getSharesWallet = mem(
  async (vault: OpenedContract<Vault>, sender: Address) => {
    const rawWalletAddress = await vault.getWalletAddress(sender);

    const rawSharesWallet = SharesWallet.createFromAddress(rawWalletAddress);

    return tonClient.open(rawSharesWallet);
  },
  {
    maxAge: 10_000,
    cacheKey: ([vault, sender]) =>
      `getSharesWallet_${vault.address.toString()}_${sender.toString()}`,
  },
);

export const getVault = async (vaultAddress: Address) => {
  const rawVault = Vault.createFromAddress(vaultAddress);
  return tonClient.open(rawVault);
};

export const getWallet = async (
  senderAddress: Address,
  poolAddress: Address,
): Promise<OpenedContract<JettonWallet>> => {
  const rawPool = JettonRoot.createFromAddress(poolAddress);

  const jettonRoot = tonClient.open(rawPool);

  const rawLpWallet = await jettonRoot.getWallet(senderAddress);
  return tonClient.open(rawLpWallet);
};

export const getVaultData = mem(
  async (vaultAddress: Address) => {
    const rawVault = Vault.createFromAddress(vaultAddress);
    const vault = tonClient.open(rawVault);

    return vault.getVaultData();
  },
  {
    maxAge: 60_000,
    cacheKey: ([vaultAddress]) => `getVaultData_${vaultAddress.toString()}`,
  },
);

export const getStrategyInfoByVault = mem(
  async (vaultAddress: Address) => {
    const { strategyAddress } = await getVaultData(vaultAddress);
    const rawStrategy = TonJettonTonStrategy.createFromAddress(strategyAddress);
    const strategy = tonClient.open(rawStrategy);

    return await strategy.getStrategyData();
  },
  {
    maxAge: 60_000,
    cacheKey: ([vaultAddress]) => `getStrategyInfoByVault_${vaultAddress.toString()}`,
  },
);
