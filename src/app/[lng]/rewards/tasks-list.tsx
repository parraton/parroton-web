import React, { useCallback } from 'react';
import { QuestProps } from '@hooks/use-points-sources';
import { useTranslation } from '@i18n/client';
import Image from 'next/image';
import { OrLoader } from '@components/loader/loader';
import { ChevronsDownIcon, StarIcon } from 'lucide-react';
import { cn } from '@lib/utils';

interface TasksListProps {
  quests: QuestProps[] | undefined;
  loading: boolean;
  pointsMultiplier: number;
}

export const TasksList = ({ quests, loading, pointsMultiplier }: TasksListProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  const renderQuests = useCallback(
    (questsList: QuestProps[]) =>
      questsList.map((quest) => (
        <QuestItem key={quest.id} pointsMultiplier={pointsMultiplier} quest={quest} />
      )),
    [pointsMultiplier],
  );

  return (
    <div className='flex flex-col items-center gap-3'>
      <p className='w-full text-lg font-medium'>{t('earn_more')}</p>
      <OrLoader animation={loading} value={quests} modifier={renderQuests} />
    </div>
  );
};

interface QuestsItemProps {
  quest: QuestProps;
  pointsMultiplier: number;
}

export const QuestItem = ({ quest, pointsMultiplier }: QuestsItemProps) => {
  const { iconSrc, title, rewardsDescription, actionIcon, onClick, onDoubleClick, isSectionName } =
    quest;

  return (
    <>
      {isSectionName && (
        <div className='my-3 flex w-full items-center gap-2'>
          <div className='flex-1 border-t bg-gray-400' />
          <ChevronsDownIcon className='size-6 text-gray-400' />
          <div className='flex-1 border-t bg-gray-400' />
        </div>
      )}
      <button
        type='button'
        className='flex w-full items-center justify-between gap-2'
        onClick={onClick}
        onDoubleClick={onDoubleClick}
      >
        <div className='flex items-center gap-2'>
          {iconSrc ? (
            <Image className='size-11' src={iconSrc} alt='' />
          ) : (
            <div className='flex size-11 items-center justify-center rounded-lg bg-custom-link'>
              <StarIcon className='size-7 fill-current text-white' />
            </div>
          )}
          <div className='text-left'>
            <p className={cn(isSectionName ? 'text-base' : 'text-xs', 'font-semibold')}>{title}</p>
            {rewardsDescription && (
              <p className='text-xs font-semibold text-custom-link'>
                {pointsMultiplier === 1 ? (
                  rewardsDescription
                ) : (
                  <>
                    <span className='line-through'>{rewardsDescription}</span>{' '}
                    <span className='rounded-sm bg-custom-content px-1'>
                      {/* eslint-disable-next-line react/jsx-no-literals */}
                      {'x'}
                      {pointsMultiplier}
                    </span>
                  </>
                )}
              </p>
            )}
          </div>
        </div>
        {actionIcon}
      </button>
    </>
  );
};
