'use client';
import { useRewardsBalance } from '@components/claim/use-rewards-balance';
import { formatNumber } from '@lib/utils';
import { useTranslation } from '@i18n/client';

export function ClaimBalance() {
  const { balance } = useRewardsBalance();
  const { lng } = useTranslation({ ns: 'common' });

  return <div>Your rewards balance: {formatNumber(balance, lng)}</div>;
}
