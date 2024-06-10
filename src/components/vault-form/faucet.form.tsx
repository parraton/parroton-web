'use client';

import { useLpBalance } from '@hooks/use-lp-balance';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { FaucetTokenButton } from '@components/faucet/faucet-token.button';
import { FaucetLpButton } from '@components/faucet/faucet-lp.button';
import { formatNumber } from '@lib/utils';
import { useVaultMetadata } from '@hooks/use-vault-metadata';
import { useJettonBalance } from '@hooks/use-jetton-balance';

const useFaucetFormData = () => {
  const { vault, lng } = useParams(VaultPage);
  const { balance: lpBalance } = useLpBalance(vault);
  const { balance: jettonBalance } = useJettonBalance(vault);
  const { metadata } = useVaultMetadata(vault);

  return {
    jettonBalance,
    lpBalance,
    currency: metadata?.symbol,
    lng,
  };
};

export function FaucetForm() {
  const { jettonBalance, lpBalance, currency, lng } = useFaucetFormData();

  const jettonSymbol = currency
    ? currency
        .toLowerCase()
        .replace('dedust', '')
        .replace('ton', '')
        .replace('/', '')
        .replace('lp', '')
        .trim()
        .toUpperCase()
    : '~~~~';

  return (
    <div className={'flex w-max flex-1 justify-between'}>
      <div className={'flex flex-col gap-2'}>
        <span>
          {jettonBalance ? formatNumber(jettonBalance, lng) : '~~~~'} {jettonSymbol}
        </span>
        <FaucetTokenButton />
      </div>
      <div className={'flex flex-col gap-2'}>
        <span>
          {lpBalance ? formatNumber(lpBalance, lng) : '~~~~'} {currency ?? '~~~~'}
        </span>
        <FaucetLpButton />
      </div>
    </div>
  );
}
