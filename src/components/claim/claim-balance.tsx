'use client';
import { useRewardsBalance } from '@components/claim/use-rewards-balance';
import { formatCurrency, formatNumber } from '@lib/utils';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';
import { useTonPrice } from '@hooks/use-ton-price';
import { multiplyIfPossible } from '@utils/multiply-if-possible';

export function ClaimBalance() {
  const { lng } = useParams(VaultPage);
  const { balance } = useRewardsBalance();
  const { tonPrice } = useTonPrice();

  console.log({ balance, tonPrice });

  const dollarBalance = multiplyIfPossible(tonPrice, balance);
  const dollar = dollarBalance != undefined ? formatCurrency(dollarBalance, lng) : '~~~~';

  return (
    <div>
      Your rewards balance: {formatNumber(balance, lng)} TON({dollar})
    </div>
  );
}
