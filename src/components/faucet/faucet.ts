import { tonClient } from '@core/config';
import { Asset, AssetType, JettonRoot, Pool, PoolType, VaultJetton } from '@dedust/sdk';
import { Address, toNano } from '@ton/core';
import { getStrategyInfoByVault } from '@core';
import { DeDustFactory } from '@core/contracts/dedust-factory';
import { addresses } from '@config/contracts-config';
import { Message } from '../../types/message.type';
import { prepareJettonTransferBody } from '@core/messages/jetton-transfer.body';
import { prepareDedustDepositTonBody } from '@core/messages/dedust-deposit-ton.body';

export const FAUCET_JETTON_AMOUNT = toNano('10');
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

export const faucetLp = async (
  investorAddress: Address,
  vaultAddress: Address,
): Promise<Message[]> => {
  const messages: Message[] = [];

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
  const nativeVaultAddress = await dedustFactory.getVaultAddress(Asset.native());
  const jettonVaultAddress = await dedustFactory.getVaultAddress(Asset.jetton(jettonAddress));

  const dedustDepositTonBody = prepareDedustDepositTonBody({
    amount: tonAmount,
    poolType: PoolType.VOLATILE,
    assets: assets,
    targetBalances: assetAmounts,
  });
  messages.push({
    address: nativeVaultAddress.toRawString(),
    amount: toNano('0.8').toString(),
    payload: dedustDepositTonBody.toBoc().toString('base64'),
  });

  const jettonRoot = tonClient.open(JettonRoot.createFromAddress(jettonAddress));
  const investorWalletAddress = await jettonRoot.getWalletAddress(investorAddress);

  const jettonTransferBody = prepareJettonTransferBody({
    destination: jettonVaultAddress,
    amount: jettonAmount,
    responseAddress: investorAddress,
    forwardAmount: toNano('0.5'),
    forwardPayload: VaultJetton.createDepositLiquidityPayload({
      poolType: PoolType.VOLATILE,
      assets: assets,
      targetBalances: assetAmounts,
    }),
  });
  messages.push({
    address: investorWalletAddress.toRawString(),
    amount: toNano('0.8').toString(),
    payload: jettonTransferBody.toBoc().toString('base64'),
  });

  return messages;
};
