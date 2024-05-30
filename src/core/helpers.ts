import { Address, OpenedContract } from '@ton/core';
import { SharesWallet, Vault } from '@core/contracts';
import { POOL_ADDRESS, tonClientPromise, VAULT_ADDRESS } from '@core/config';
import { JettonRoot, JettonWallet } from '@dedust/sdk';

export function exists<T>(value: T | null | undefined | any): T {
  if (value == undefined) {
    throw new Error('Value does not exist');
  }
  return value;
}

export const getSharesWallet = async (vault: OpenedContract<Vault>, sender: Address) => {
  const tonClient = await tonClientPromise;
  const rawWalletAddress = await vault.getWalletAddress(sender);

  const rawSharesWallet = SharesWallet.createFromAddress(rawWalletAddress);

  return tonClient.open(rawSharesWallet);
};

export const getVault = async (vaultAddress = VAULT_ADDRESS) => {
  const tonClient = await tonClientPromise;

  const rawVault = Vault.createFromAddress(vaultAddress);
  return tonClient.open(rawVault);
};

export const getLpWallet = async (
  senderAddress: Address,
  poolAddress = POOL_ADDRESS,
): Promise<OpenedContract<JettonWallet>> => {
  const tonClient = await tonClientPromise;
  const rawPool = JettonRoot.createFromAddress(poolAddress);

  const jettonRoot = tonClient.open(rawPool);

  const rawLpWallet = await jettonRoot.getWallet(senderAddress);
  return tonClient.open(rawLpWallet);
};
