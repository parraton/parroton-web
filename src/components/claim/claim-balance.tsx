'use client';
import { useRewardsBalance } from '@components/claim/use-rewards-balance';
import { formatNumber } from '@lib/utils';
import { useParams } from '@routes/hooks';
import { VaultPage } from '@routes';

export function ClaimBalance() {
  const { lng } = useParams(VaultPage);
  const { balance } = useRewardsBalance();

  return <div>Your rewards balance: {formatNumber(balance, lng)}</div>;
}
