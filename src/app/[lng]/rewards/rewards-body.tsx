'use client';

import React, { useEffect, useState } from 'react';
import { usePointsSources } from '../../../hooks/use-points-sources';
import { ReferralModal } from './referral-modal';
import { InvitedFriendsList } from './invited-friends-list';
import { TasksList } from './tasks-list';
import { RewardsHeader } from './rewards-header';
import { useTranslation } from '@i18n/client';

export const RewardsBody = () => {
  const { t } = useTranslation({ ns: 'rewards' });
  const {
    invitedFriends,
    invitedFriendsLoading,
    quests,
    questsLoading,
    totalPointsEarned,
    userDataLoading,
    referralModalIsOpen,
    isTelegram,
    closeReferralModal,
    claimFriendRewards,
  } = usePointsSources();

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => setIsFirstRender(false), []);

  if (isFirstRender) {
    return null;
  }

  if (isTelegram) {
    return (
      <>
        <RewardsHeader amount={totalPointsEarned} loading={userDataLoading} />
        <InvitedFriendsList
          data={invitedFriends}
          loading={invitedFriendsLoading}
          claimRewards={claimFriendRewards}
        />
        <TasksList quests={quests} loading={questsLoading} />
        <ReferralModal isOpen={referralModalIsOpen} onClose={closeReferralModal} />
      </>
    );
  }

  return <h1 className='text-center text-2xl font-semibold'>{t('use_telegram_mini_app')}</h1>;
};
