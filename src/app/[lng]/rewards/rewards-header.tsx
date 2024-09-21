import { useTranslation } from '@i18n/client';
import React from 'react';

interface RewardsHeaderProps {
  totalPointsEarned: number;
}

export const RewardsHeader = ({ totalPointsEarned }: RewardsHeaderProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  return (
    <>
      <h1 className='text-center text-2xl font-semibold'>{t('earn_points_title')}</h1>
      <h2 className='text-center text-lg font-semibold'>{totalPointsEarned}</h2>
    </>
  );
};
