import React from 'react';
import { TaskProps } from '../../../hooks/use-points-sources';
import { useTranslation } from '@i18n/client';
import Image from 'next/image';

interface TasksListProps {
  tasks: TaskProps[];
}

export const TasksList = ({ tasks }: TasksListProps) => {
  const { t } = useTranslation({ ns: 'rewards' });

  return (
    <>
      <p>{t('earn_more')}</p>
      {tasks.map(({ id, iconSrc, title, rewardsDescription, actionButton }) => (
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
      ))}
    </>
  );
};
