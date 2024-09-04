import { Sender } from '@utils/sender';
import { tonClient } from '@core/config';
import { Asset, AssetType, JettonRoot, Pool, PoolType, VaultJetton } from '@dedust/sdk';
import { Address, toNano } from '@ton/core';
import { getStrategyInfoByVault } from '@core';
import { JettonMinter } from '@core/contracts/jetton-minter';
import { mint } from '@core/functions/mint';
import { DeDustFactory } from '@core/contracts/dedust-factory';
import { addresses } from '@config/contracts-config';

const tonAmount = toNano('1');
const jettonAmount = toNano('10');

const fixAssets = (candidateAssets: [Asset, Asset]): [Asset, Asset] => {
  const assets = [...candidateAssets];
  if (assets[0].type !== AssetType.NATIVE && assets[1].type !== AssetType.NATIVE) {
    throw new Error('Only native/jetton assets are supported');
  }
  if (assets[0].type !== AssetType.NATIVE) {
    assets.reverse();
  }
  return assets as [Asset, Asset];
};

export const faucetToken = async (sender: Sender, vaultAddress: Address) => {
  if (!sender.address) {
    throw new Error('Wallet is not connected');
  }

  const { jettonMasterAddress } = await getStrategyInfoByVault(vaultAddress);

  const rawJettonMinter = JettonMinter.createFromAddress(jettonMasterAddress);
  const jettonMinter = tonClient.open(rawJettonMinter);

  await mint(jettonMinter, sender, sender.address, jettonAmount);
};

export const faucetLp = async (sender: Sender, vaultAddress: Address) => {
  if (!sender.address) {
    throw new Error('Wallet is not connected');
  }

  const { poolAddress } = await getStrategyInfoByVault(vaultAddress);

  const rawPool = Pool.createFromAddress(poolAddress);
  const pool = tonClient.open(rawPool);
  const rawAssets = await pool.getAssets();
  const assets = fixAssets(rawAssets);

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
