import { tonClient } from '@core/config';
import { Asset, AssetType, JettonRoot, PoolType, VaultJetton } from '@dedust/sdk';
import { Address, toNano } from '@ton/core';
import { DeDustFactory } from '@core/contracts/dedust-factory';
import { addresses } from '@config/contracts-config';
import { Message } from '../../types/message.type';
import { prepareJettonTransferBody } from '@core/messages/jetton-transfer.body';
import { prepareDedustDepositTonBody } from '@core/messages/dedust-deposit-ton.body';
import type { Asset as BackendAsset, Vault as BackendVault } from '@hooks/use-vaults';

const tonAmount = toNano('1');
const jettonAmount = toNano('10');

const makeJettonAsset = (asset: BackendAsset) => Asset.jetton(Address.parse(asset.address));

export const faucetLp = async (
  investorAddress: Address,
  { assets: backendAssets }: BackendVault,
): Promise<Message[]> => {
  const messages: Message[] = [];

  const isTonToJettonVault = backendAssets.length === 1;
  const assets: [Asset, Asset] = isTonToJettonVault
    ? [Asset.native(), makeJettonAsset(backendAssets[0])]
    : [makeJettonAsset(backendAssets[0]), makeJettonAsset(backendAssets[1])];

  const assetAmounts: [bigint, bigint] = [tonAmount, jettonAmount];

  const rawDeDustFactory = DeDustFactory.createFromAddress(addresses.dedustFactory);
  const dedustFactory = tonClient.open(rawDeDustFactory);
  const nativeVaultAddress = await dedustFactory.getVaultAddress(Asset.native());

  if (isTonToJettonVault) {
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
  }

  for (const asset of assets) {
    if (asset.type === AssetType.NATIVE) {
      continue;
    }

    const jettonAddress =
      asset.address ?? Address.parse('EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c');

    const jettonRoot = tonClient.open(JettonRoot.createFromAddress(jettonAddress));
    const jettonVault = await dedustFactory.getJettonVault(jettonRoot.address);
    const investorWalletAddress = await jettonRoot.getWalletAddress(investorAddress);

    const jettonTransferBody = prepareJettonTransferBody({
      destination: jettonVault.address,
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
  }

  return messages;
};
