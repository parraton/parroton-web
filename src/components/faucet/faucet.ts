import { Sender } from '@utils/sender';
import { tonClient } from '@core/config';
import { Asset, JettonRoot, PoolType, VaultJetton } from '@dedust/sdk';
import { Address, toNano } from '@ton/core';
import { JettonMinter } from '@core/contracts/jetton-minter';
import { mint } from '@core/functions/mint';
import { DeDustFactory } from '@core/contracts/dedust-factory';
import { addresses } from '@config/contracts-config';
import type { Asset as BackendAsset, Vault as BackendVault } from '@hooks/use-vaults';

const tonAmount = toNano('0.1');
const jettonAmount = toNano('1');

/* const fixAssets = (candidateAssets: [Asset, Asset]): [Asset, Asset] => {
  const assets = [...candidateAssets];
  if (assets[0].type !== AssetType.NATIVE && assets[1].type !== AssetType.NATIVE) {
    throw new Error('Only native/jetton assets are supported');
  }
  if (assets[0].type !== AssetType.NATIVE) {
    assets.reverse();
  }
  return assets as [Asset, Asset];
}; */

export const faucetToken = async (sender: Sender, assetAddress: string) => {
  if (!sender.address) {
    throw new Error('Wallet is not connected');
  }

  const rawJettonMinter = JettonMinter.createFromAddress(Address.parse(assetAddress));
  const jettonMinter = tonClient.open(rawJettonMinter);

  await mint(jettonMinter, sender, sender.address, jettonAmount);
};

const makeJettonAsset = (asset: BackendAsset) => Asset.jetton(Address.parse(asset.address));

export const faucetLp = async (sender: Sender, { assets: backendAssets }: BackendVault) => {
  if (!sender.address) {
    throw new Error('Wallet is not connected');
  }

  const assets: [Asset, Asset] =
    backendAssets.length === 1
      ? [Asset.native(), makeJettonAsset(backendAssets[0])]
      : [makeJettonAsset(backendAssets[0]), makeJettonAsset(backendAssets[1])];

  const assetAmounts: [bigint, bigint] = [tonAmount, jettonAmount];
  const jettonAddress =
    assets[1].address || Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

  const rawDeDustFactory = DeDustFactory.createFromAddress(addresses.dedustFactory);
  const dedustFactory = tonClient.open(rawDeDustFactory);
  const nativeVault = tonClient.open(await dedustFactory.getNativeVault());
  const jettonVault = tonClient.open(await dedustFactory.getJettonVault(jettonAddress));

  await nativeVault.sendDepositLiquidity(sender, {
    poolType: PoolType.VOLATILE,
    assets: assets,
    targetBalances: assetAmounts,
    amount: tonAmount,
  });

  const jettonRoot = tonClient.open(JettonRoot.createFromAddress(jettonAddress));
  const investorJettonWallet = tonClient.open(await jettonRoot.getWallet(sender.address!));

  await investorJettonWallet.sendTransfer(sender, toNano('1.2'), {
    amount: jettonAmount,
    destination: jettonVault.address,
    responseAddress: sender.address!,
    forwardAmount: toNano('1'),
    forwardPayload: VaultJetton.createDepositLiquidityPayload({
      poolType: PoolType.VOLATILE,
      assets: assets,
      targetBalances: assetAmounts,
    }),
  });

  await sender.sendBatch();
};
