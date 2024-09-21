'use client';

import React from 'react';
import { usePointsSources } from './use-points-sources';
import { ReferralModal } from './referral-modal';
import { InvitedFriendsList } from './invited-friends-list';
import { TasksList } from './tasks-list';
import { RewardsHeader } from './rewards-header';

export const RewardsBody = () => {
  const {
    invitedFriends,
    tasks,
    totalPointsEarned,
    referralModalIsOpen,
    closeReferralModal,
    claimFriendRewards,
  } = usePointsSources();

  return (
    <>
      <RewardsHeader totalPointsEarned={totalPointsEarned} />
      <InvitedFriendsList invitedFriends={invitedFriends} claimRewards={claimFriendRewards} />
      <TasksList tasks={tasks} />
      <ReferralModal isOpen={referralModalIsOpen} onClose={closeReferralModal} />
    </>
  );
};
