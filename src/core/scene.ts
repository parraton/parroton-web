import {deposit} from '@core/functions/deposit';
import {withdraw} from '@core/functions/withdraw';
import {Address, toNano} from '@ton/core';
import {Asset, JettonRoot, PoolType} from '@dedust/sdk';
import {SharesWallet} from '@core/contracts/shares-wallet';
import {Vault} from '@core/contracts/vault';
import {mint} from '@core/functions/mint';
import {JettonMinter} from '@core/contracts/jetton-minter';
import {
  DEDUST_ADDRESS,
  POOL_ADDRESS,
  TOKEN_ADDRESS,
  tonClientPromise,
  VAULT_ADDRESS,
} from '@core/config';
import {depositPool} from '@core/functions/deposit-pool';
import {DeDustFactory} from '@core/contracts/dedust-factory';
import {exists} from '@core/helpers';
import {Sender} from "@utils/sender";

export const scene = async (sender: Sender) => {
  const jettonAmount = toNano(10);
  const tonAmount = toNano(1);
  const lpDepositAmount = Math.floor(Math.random() * 1000) + 1;
  const nativeAsset = Asset.native();

  const jettonWithdrawalAmount = Math.floor(Math.random() * lpDepositAmount) + 1;

  const tonClient = await tonClientPromise;

  console.log({sender});

  const SENDER_ADDRESS = exists<Address>(sender.address);

  const jettonRoot = tonClient.open(JettonRoot.createFromAddress(POOL_ADDRESS));
  console.debug('JETTON ROOT IS OPENED');

  const investorLpWallet = tonClient.open(await jettonRoot.getWallet(SENDER_ADDRESS));
  console.debug('INVESTOR LP WALLET IS OPENED');

  const vault = tonClient.open(Vault.createFromAddress(VAULT_ADDRESS));
  console.debug('VAULT IS OPENED');

  const investorSharesWallet = tonClient.open(
    SharesWallet.createFromAddress(await vault.getWalletAddress(SENDER_ADDRESS)),
  );
  console.debug('INVESTOR SHARES WALLET IS OPENED');

  const jettonMinter = tonClient.open(JettonMinter.createFromAddress(TOKEN_ADDRESS));
  console.debug('JETTON MINTER IS OPENED');

  const dedustFactory = tonClient.open(DeDustFactory.createFromAddress(DEDUST_ADDRESS));
  console.debug('DEDUST FACTORY IS OPENED');

  const jettonAsset = Asset.jetton(jettonMinter.address);
  const assets: [Asset, Asset] = [nativeAsset, jettonAsset];

  console.debug('POOL IS OPENED');

  // await mint(jettonMinter, sender, SENDER_ADDRESS, jettonAmount);

  // await deposit(investorLpWallet, vault, sender, jettonAmount);
  // //
  // await withdraw(investorSharesWallet, sender, toNano(5));
};

const assets: [Asset, Asset] = [Asset.native(), Asset.jetton(TOKEN_ADDRESS)];

export const poolDeposit = async (sender: Sender) => {
  const jettonAmount = toNano(1);
  const tonAmount = toNano(0.1);

  const tonClient = await tonClientPromise;
  const dedustFactory = tonClient.open(DeDustFactory.createFromAddress(DEDUST_ADDRESS));
  const pool = tonClient.open(await dedustFactory.getPool(PoolType.VOLATILE, assets));

  await depositPool(dedustFactory, pool, sender, tonAmount, jettonAmount);

  return {
    jettonAmount,
    tonAmount,
  }
}
