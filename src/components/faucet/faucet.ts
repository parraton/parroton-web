import { Sender } from '@utils/sender';
import { tonClient } from '@core/config';
import { Asset, AssetType, JettonRoot, PoolType, VaultJetton } from '@dedust/sdk';
import { Address, toNano } from '@ton/core';
import { JettonMinter } from '@core/contracts/jetton-minter';
import { mint } from '@core/functions/mint';
import { DeDustFactory } from '@core/contracts/dedust-factory';
import { addresses } from '@config/contracts-config';
import type { Asset as BackendAsset, Vault as BackendVault } from '@hooks/use-vaults';

const tonAmount = toNano('0.1');
const jettonAmount = toNano('1');

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

  const isTonToJettonVault = backendAssets.length === 1;
  const assets: [Asset, Asset] = isTonToJettonVault
    ? [Asset.native(), makeJettonAsset(backendAssets[0])]
    : [makeJettonAsset(backendAssets[0]), makeJettonAsset(backendAssets[1])];

  const assetAmounts: [bigint, bigint] = [tonAmount, jettonAmount];

  const rawDeDustFactory = DeDustFactory.createFromAddress(addresses.dedustFactory);
  const dedustFactory = tonClient.open(rawDeDustFactory);
  const nativeVault = tonClient.open(await dedustFactory.getNativeVault());

  if (isTonToJettonVault) {
    await nativeVault.sendDepositLiquidity(sender, {
      poolType: PoolType.VOLATILE,
      assets: assets,
      targetBalances: assetAmounts,
      amount: tonAmount,
    });
  }

  for (const asset of assets) {
    if (asset.type === AssetType.NATIVE) {
      continue;
    }

    const jettonAddress =
      asset.address ?? Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');
    const jettonVault = tonClient.open(await dedustFactory.getJettonVault(jettonAddress));
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
  }

  await sender.sendBatch();
};
