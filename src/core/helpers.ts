import mem from 'mem';

import { Address, OpenedContract } from '@ton/core';
import { SharesWallet, Vault } from '@parraton/sdk';
import { tonClient } from '@core/config';
import { JettonRoot, JettonWallet } from '@dedust/sdk';

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

export const getWalletAddress = async (
  senderAddress: Address,
  poolAddress: Address,
): Promise<Address> => {
  const rawPool = JettonRoot.createFromAddress(poolAddress);

  const jettonRoot = tonClient.open(rawPool);

  return await jettonRoot.getWalletAddress(senderAddress);
};
