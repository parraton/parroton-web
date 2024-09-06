'use client';

import { useLpBalance } from '@hooks/use-lp-balance';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { FaucetTokenButton } from '@components/faucet/faucet-token.button';
import { FaucetLpButton } from '@components/faucet/faucet-lp.button';
import { formatNumber } from '@lib/utils';
import { useJettonBalance } from '@hooks/use-jetton-balance';
import { OrLoader } from '@components/loader/loader';
import { useVaultData } from '@hooks/use-vault-data';

const useFaucetFormData = () => {
  const { vault: vaultAddress, lng } = useParams(VaultPage);
  const { balance: lpBalance } = useLpBalance(vaultAddress);
  const { balance: jettonBalance } = useJettonBalance(vaultAddress);
  const { vault } = useVaultData(vaultAddress);

  return {
    jettonBalance,
    lpBalance,
    name: vault?.lpMetadata.name,
    currency: vault?.lpMetadata.symbol,
    lng,
  };
};

export function FaucetForm() {
  const { jettonBalance, lpBalance, name, currency, lng } = useFaucetFormData();

  const jettonSymbol = name
    ? name.toLowerCase().replace('dedust pool: ton/', '').trim().toUpperCase()
    : undefined;

  return (
    <div className={'flex w-max flex-1 justify-between'}>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex gap-2'}>
          <OrLoader value={jettonBalance} modifier={(x) => formatNumber(x, lng)} />{' '}
          <OrLoader animation value={jettonSymbol} />
        </div>
        <FaucetTokenButton disabled={false} />
      </div>
      <div className={'flex flex-col gap-2'}>
        <div className={'flex gap-2'}>
          <OrLoader value={lpBalance} modifier={(x) => formatNumber(x, lng)} />{' '}
          <OrLoader animation value={currency} />
        </div>
        <FaucetLpButton disabled={!Number(jettonBalance)} />
      </div>
    </div>
  );
}
