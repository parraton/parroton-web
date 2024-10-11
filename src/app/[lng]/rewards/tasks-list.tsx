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
}

export const TasksList = ({ quests, loading }: TasksListProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  const renderQuests = useCallback(
    (questsList: QuestProps[]) =>
      questsList.map((quest) => <QuestItem key={quest.id} quest={quest} />),
    [],
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
}

export const QuestItem = ({ quest }: QuestsItemProps) => {
  const { id, iconSrc, title, rewardsDescription, actionButton, isSectionName } = quest;

  return (
    <>
      {isSectionName && (
        <div className='my-3 flex w-full items-center gap-2'>
          <div className='flex-1 border-t bg-gray-400' />
          <ChevronsDownIcon className='size-6 text-gray-400' />
          <div className='flex-1 border-t bg-gray-400' />
        </div>
      )}
      <div className='flex w-full items-center justify-between gap-2' key={id}>
        <div className='flex items-center gap-2'>
          {iconSrc ? (
            <Image className='size-11' src={iconSrc} alt='' />
          ) : (
            <div className='flex size-11 items-center justify-center rounded-lg bg-custom-link'>
              <StarIcon className='size-7 fill-current text-white' />
            </div>
          )}
          <div>
            <p className={cn(isSectionName ? 'text-base' : 'text-xs', 'font-semibold')}>{title}</p>
            {rewardsDescription && (
              <p className='text-xs font-semibold text-custom-link'>{rewardsDescription}</p>
            )}
          </div>
        </div>
        {actionButton}
      </div>
    </>
  );
};
