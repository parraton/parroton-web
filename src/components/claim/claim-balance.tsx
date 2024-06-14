'use client';
import { useRewardsBalance } from '@components/claim/use-rewards-balance';
import { formatCurrency, formatNumber } from '@lib/utils';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useTonPrice } from '@hooks/use-ton-price';
import { multiplyIfPossible } from '@utils/multiply-if-possible';
import { useTranslation } from '@i18n/client';
import { OrLoader } from '@components/loader/loader';

export function ClaimBalance() {
  const { lng } = useParams(VaultPage);
  const { balance } = useRewardsBalance();
  const { tonPrice } = useTonPrice();
  const { t } = useTranslation({ ns: 'form' });

  const dollarBalance = multiplyIfPossible(tonPrice, balance);
  const dollar = (
    <OrLoader value={dollarBalance} modifier={(x) => formatCurrency(x, lng)} />
  );

  return (
    <div>
      {t('claim.text', { balance: formatNumber(balance, lng), dollar })}
    </div>
  );
}
