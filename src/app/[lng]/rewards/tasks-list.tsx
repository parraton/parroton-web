import React, { useCallback } from 'react';
import { QuestProps } from '@hooks/use-points-sources';
import { useTranslation } from '@i18n/client';
import Image from 'next/image';
import { OrLoader } from '@components/loader/loader';
import { StarIcon } from 'lucide-react';

interface TasksListProps {
  quests: QuestProps[] | undefined;
  loading: boolean;
}

export const TasksList = ({ quests, loading }: TasksListProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  const renderQuests = useCallback(
    (questsList: QuestProps[]) =>
      questsList.map(({ id, iconSrc, title, rewardsDescription, actionButton }) => (
        <div className='flex items-center justify-between gap-2' key={id}>
          <div className='flex items-center gap-2'>
            {iconSrc && <Image className='size-11' src={iconSrc} alt='' />}
            <div>
              <p className='text-xs font-semibold'>{title}</p>
              {rewardsDescription && <p className='text-xs font-semibold'>{rewardsDescription}</p>}
            </div>
          </div>
          {actionButton}
        </div>
      )),
    [],
  );

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-lg font-semibold'>{t('earn_more')}</p>
      <OrLoader animation={loading} value={quests} modifier={renderQuests} />
    </div>
  );
};

interface QuestsItemProps {
  quest: QuestProps;
}

export const QuestItem = ({ quest }: QuestsItemProps) => {
  const { id, iconSrc, title, rewardsDescription, actionButton } = quest;

  return (
    <div className='flex items-center justify-between gap-2' key={id}>
      <div className='flex items-center gap-2'>
        {iconSrc ? (
          <Image className='size-11' src={iconSrc} alt='' />
        ) : (
          <div className='flex size-11 items-center justify-center rounded-lg bg-custom-link'>
            <StarIcon className='size-7 fill-current text-white' />
          </div>
        )}
        <div>
          <p className='text-xs font-semibold'>{title}</p>
          {rewardsDescription && <p className='text-xs font-semibold'>{rewardsDescription}</p>}
        </div>
      </div>
      {actionButton}
    </div>
  );
};
