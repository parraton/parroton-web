'use client';

import React from 'react';
import { InvitedFriendsList } from './invited-friends-list';
import { TasksList } from './tasks-list';
import { RewardsHeader } from './rewards-header';
import { useTranslation } from '@i18n/client';
import { useIsFirstRender } from '@hooks/use-is-first-render';
import { usePointsSources } from '@hooks/use-points-sources';
import ReactConfetti from 'react-confetti';

export const RewardsBody = () => {
  const { t } = useTranslation({ ns: 'rewards' });
  const {
    invitedFriends,
    invitedFriendsLoading,
    userLevel,
    levelProgress,
    quests,
    questsLoading,
    totalPointsEarned,
    userDataLoading,
    isTelegram,
    claimFriendRewards,
    hiddenShareAnchorRef,
    hiddenAnchorHref,
    shouldRunConfetti,
    stopConfetti,
  } = usePointsSources();

  const isFirstRender = useIsFirstRender();

  if (isFirstRender) {
    return null;
  }

  if (isTelegram) {
    return (
      <>
        <RewardsHeader
          amount={totalPointsEarned}
          loading={userDataLoading}
          level={userLevel}
          levelProgress={levelProgress}
        />
        <InvitedFriendsList
          data={invitedFriends}
          loading={invitedFriendsLoading}
          claimRewards={claimFriendRewards}
        />
        <TasksList quests={quests} loading={questsLoading} />
        <a className='hidden' ref={hiddenShareAnchorRef} href={hiddenAnchorHref} />
        {shouldRunConfetti && (
          <div className='confetti-container'>
            <ReactConfetti recycle={false} onConfettiComplete={stopConfetti} />
          </div>
        )}
      </>
    );
  }

  return <h1 className='text-center text-2xl font-semibold'>{t('use_telegram_mini_app')}</h1>;
};
