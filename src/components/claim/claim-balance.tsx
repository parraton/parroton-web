'use client';
/* eslint-disable react/jsx-no-literals */

import { useRewardsBalance } from '@components/claim/use-rewards-balance';
import { formatCurrency, formatNumber } from '@lib/utils';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useTonPrice } from '@hooks/use-ton-price';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { OrLoader } from '@components/loader/loader';
import { useTranslation } from '@i18n/client';

export function ClaimBalance() {
  const { lng } = useParams(VaultPage);
  const { balance } = useRewardsBalance();
  const { tonPrice } = useTonPrice();
  const { t } = useTranslation({ ns: 'form' });

  const dollarBalance = multiplyIfPossible(tonPrice, balance);

  return (
    <div>
      <div className={'flex gap-2'}>
        {t('claim.balance')}: <OrLoader value={balance} modifier={(x) => formatNumber(x, lng)} />{' '}
        TON (
        <OrLoader value={dollarBalance} modifier={(x) => formatCurrency(x, lng)} />)
      </div>
    </div>
  );
}
