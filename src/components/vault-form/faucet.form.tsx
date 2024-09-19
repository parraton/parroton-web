'use client';

import { useLpBalance } from '@hooks/use-lp-balance';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { FaucetTokenButton } from '@components/faucet/faucet-token.button';
import { FaucetLpButton } from '@components/faucet/faucet-lp.button';
import { formatNumber } from '@lib/utils';
import { useJettonsBalances } from '@hooks/use-jettons-balances';
import { OrLoader } from '@components/loader/loader';
import { useVaultData } from '@hooks/use-vault-data';

const useFaucetFormData = () => {
  const { vault: vaultAddress, lng } = useParams(VaultPage);
  const { balance: lpBalance } = useLpBalance(vaultAddress);
  const { vault } = useVaultData(vaultAddress);
  const assets = vault?.assets;

  const { balances: jettonsBalances } = useJettonsBalances(assets);

  return {
    jettonsBalances,
    lpBalance,
    currency: vault?.lpMetadata.symbol,
    assets,
    lng,
  };
};

export function FaucetForm() {
  const { jettonsBalances, lpBalance, currency, assets, lng } = useFaucetFormData();

  return (
    <div className={'flex w-max flex-1 justify-between'}>
      {assets?.map((asset, i) => (
        <div key={asset.address} className={'flex flex-col gap-2'}>
          <div className={'flex gap-2'}>
            <OrLoader value={jettonsBalances?.[i]} modifier={(x) => formatNumber(x, lng)} />{' '}
            <OrLoader animation value={asset.symbol} />
          </div>
          <FaucetTokenButton disabled={false} assetAddress={asset.address} />
        </div>
      ))}
      <div className={'flex flex-col gap-2'}>
        <div className={'flex gap-2'}>
          <OrLoader value={lpBalance} modifier={(x) => formatNumber(x, lng)} />{' '}
          <OrLoader animation value={currency} />
        </div>
        <FaucetLpButton
          disabled={!jettonsBalances || jettonsBalances.some((v) => Number(v) === 0)}
        />
      </div>
    </div>
  );
}
