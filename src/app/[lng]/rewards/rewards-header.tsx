import { OrLoader } from '@components/loader/loader';
import { useTranslation } from '@i18n/client';
import { LEVELS_THRESHOLDS } from '@lib/constants';
import { cn } from '@lib/utils';
import React from 'react';
import { Trans } from 'react-i18next';

interface RewardsHeaderProps {
  amount: number | undefined;
  loading: boolean;
  level: number | undefined;
}

export const RewardsHeader = ({ amount, loading, level }: RewardsHeaderProps) => (
  <>
    <div className='flex flex-col gap-2'>
      <h1 className='text-center text-2xl font-bold'>
        <Trans
          i18nKey='rewards:earn_points_title'
          components={{
            1: <span className='text-custom-button' />,
            2: <span className='text-custom-link' />,
          }}
        />
      </h1>
      <div className='flex w-full justify-center'>
        <OrLoader
          value={amount}
          animation={loading}
          modifier={() => <h2 className='w-full text-center text-3xl font-semibold'>{amount}</h2>}
        />
      </div>
    </div>
    {level !== undefined && (
      <div className='flex'>
        <LevelElement reached value={level} />
        {level <= LEVELS_THRESHOLDS.length && <LevelElement reached={false} value={level + 1} />}
      </div>
    )}
  </>
);

interface LevelElementProps {
  reached: boolean;
  value: number;
}

export const LevelElement = ({ reached, value }: LevelElementProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  return (
    <div
      className={cn(
        'flex h-8 flex-1 items-center justify-center text-sm font-semibold leading-tight',
        reached ? 'bg-custom-link text-background' : 'bg-gray-300 dark:bg-gray-600',
      )}
    >
      {t('level_number', { level: value })}
    </div>
  );
};
