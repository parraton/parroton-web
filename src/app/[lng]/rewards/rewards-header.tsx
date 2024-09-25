import { OrLoader } from '@components/loader/loader';
import { useTranslation } from '@i18n/client';
import React from 'react';

interface RewardsHeaderProps {
  amount: number | undefined;
  loading: boolean;
}

export const RewardsHeader = ({ amount, loading }: RewardsHeaderProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  return (
    <>
      <h1 className='text-center text-2xl font-semibold'>{t('earn_points_title')}</h1>
      <div className='flex w-full items-center'>
        <OrLoader
          value={amount}
          animation={loading}
          modifier={() => <h2 className='w-full text-center text-lg font-semibold'>{amount}</h2>}
        />
      </div>
    </>
  );
};
