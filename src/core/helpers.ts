import { Address, fromNano, OpenedContract } from '@ton/core';
import { SharesWallet, Vault } from '@core/contracts';
import { tonClient } from '@core/config';
import { JettonRoot, JettonWallet } from '@dedust/sdk';
import { Strategy } from '@core/contracts/strategy';
import { DistributionPool } from '@dedust/apiary-v1';
import { tonApiHttpClient } from '@core/tonapi';
import { Action } from 'tonapi-sdk-js';

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

export const getWallet = async (
  senderAddress: Address,
  poolAddress: Address,
): Promise<OpenedContract<JettonWallet>> => {
  const rawPool = JettonRoot.createFromAddress(poolAddress);

  const jettonRoot = tonClient.open(rawPool);

  const rawLpWallet = await jettonRoot.getWallet(senderAddress);
  return tonClient.open(rawLpWallet);
};

export const getVaultData = async (vaultAddress: Address) => {
  const rawVault = Vault.createFromAddress(vaultAddress);
  const vault = tonClient.open(rawVault);

  return await vault.getVaultData();
};

export const getStrategyInfoByVault = async (vaultAddress: Address) => {
  const { strategyAddress } = await getVaultData(vaultAddress);
  const rawStrategy = Strategy.createFromAddress(strategyAddress);
  const strategy = tonClient.open(rawStrategy);

  return await strategy.getStrategyData();
};

export const getMetadataLink = async (vaultAddress: string) => {
  const rawPoolJetton = JettonRoot.createFromAddress(Address.parse(vaultAddress));
  const poolJetton = tonClient.open(rawPoolJetton);
  const { content } = await poolJetton.getJettonData();

  const slice = content.beginParse();

  slice.loadUint(8);

  return slice.loadStringTail();
};

const getEventsForLastWeek = async (address: string) => {
  const now = Math.floor(Date.now() / 1000);

  const weekAgo = now - 7 * 24 * 60 * 60;

  const { events } = await tonApiHttpClient.accounts.getAccountEvents(address, {
    limit: 100,
    start_date: weekAgo,
    end_date: now,
  });

  return events;
};

const isAddressEqual = (address1: string | Address, address2: string | Address) => {
  const isAddress1String = typeof address1 === 'string';
  const isAddress2String = typeof address2 === 'string';

  const address1Address = isAddress1String ? Address.parse(address1) : address1;
  const address2Address = isAddress2String ? Address.parse(address2) : address2;

  return address1Address.toString() === address2Address.toString();
};

const calcSumForActions = (actions: Action[]) => {
  return actions.reduce((acc, action) => {
    return acc + BigInt(action.TonTransfer!.amount);
  }, BigInt(0));
};

export const getVaultRewards = async (distributionPool: OpenedContract<DistributionPool>) => {
  const { tokenWalletAddress } = await distributionPool.getPoolExtraData();

  const events = await getEventsForLastWeek(tokenWalletAddress.toString());

  const filteredActions = [];

  for (const event of events) {
    const { actions } = event;
    for (const action of actions) {
      const { type } = action;
      if (type !== 'TonTransfer' || !('TonTransfer' in action)) {
        continue;
      }

      const { TonTransfer } = action;
      const { recipient } = TonTransfer!;

      if (isAddressEqual(recipient.address, tokenWalletAddress)) {
        filteredActions.push(action);
        break;
      }
    }
  }

  return fromNano(calcSumForActions(filteredActions));
};

export const getDedustRewards = async (
  vaultAddress: string,
  distributionPool: OpenedContract<DistributionPool>,
) => {
  const { tokenWalletAddress } = await distributionPool.getPoolExtraData();

  const events = await getEventsForLastWeek(tokenWalletAddress.toString());

  const filteredActions = [];

  for (const event of events) {
    const { actions } = event;
    for (const action of actions) {
      const { type } = action;
      if (type !== 'TonTransfer' || !('TonTransfer' in action)) {
        continue;
      }

      const { TonTransfer } = action;
      const { sender, recipient } = TonTransfer!;

      const isWalletSender = isAddressEqual(sender.address, tokenWalletAddress);
      const isVaultRecipient = isAddressEqual(recipient.address, vaultAddress);
      if (isWalletSender && isVaultRecipient) {
        filteredActions.push(action);
        break;
      }
    }
  }

  return fromNano(calcSumForActions(filteredActions));
};
