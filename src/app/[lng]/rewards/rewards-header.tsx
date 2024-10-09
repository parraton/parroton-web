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
  levelProgress: number | undefined;
}

export const RewardsHeader = ({
  amount,
  loading,
  level,
  levelProgress = 0,
}: RewardsHeaderProps) => {
  const { t } = useTranslation({ ns: 'rewards' });
  const isMaxLevel = (level ?? 1) > LEVELS_THRESHOLDS.length;

  return (
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
        <div
          className={cn(
            'relative flex h-8 items-center bg-switcher px-2 text-sm font-semibold leading-tight',
            isMaxLevel ? 'justify-center' : 'justify-between',
          )}
        >
          <div
            className='absolute inset-y-0 left-0 bg-custom-link'
            style={{ right: `${(1 - levelProgress) * 100}%` }}
          />
          <span className='z-[1]'>{t('level_number', { level })}</span>
          {!isMaxLevel && <span className='z-[1]'>{t('level_number', { level: level + 1 })}</span>}
        </div>
      )}
    </>
  );
};
