'use client';

import { useLpBalance } from '@hooks/use-lp-balance';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { FaucetTokenButton } from '@components/faucet/faucet-token.button';
import { FaucetLpButton } from '@components/faucet/faucet-lp.button';
import { formatNumber } from '@lib/utils';
import { useJettonBalance } from '@hooks/use-jetton-balance';
import { OrLoader } from '@components/loader/loader';
import { usePoolMetadata } from '@hooks/use-pool-metadata';

const useFaucetFormData = () => {
  const { vault, lng } = useParams(VaultPage);
  const { balance: lpBalance } = useLpBalance(vault);
  const { balance: jettonBalance } = useJettonBalance(vault);
  const { metadata } = usePoolMetadata(vault);

  return {
    jettonBalance,
    lpBalance,
    name: metadata?.name,
    currency: metadata?.symbol,
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
