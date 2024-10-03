import React, { useCallback } from 'react';
import { QuestProps } from '../../../hooks/use-points-sources';
import { useTranslation } from '@i18n/client';
import Image from 'next/image';
import { OrLoader } from '@components/loader/loader';

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
            <Image className='size-12' src={iconSrc} alt='' />
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
    <>
      <p>{t('earn_more')}</p>
      <OrLoader animation={loading} value={quests} modifier={renderQuests} />
    </>
  );
};
