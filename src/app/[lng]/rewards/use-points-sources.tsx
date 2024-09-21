import React, { useCallback, useMemo, useState } from 'react';

import addPersonSrc from '../../../images/add-person.png';
import depositLiquiditySrc from '../../../images/deposit-liquidity.png';
import telegramSrc from '../../../images/telegram.png';
import { useTranslation } from '@i18n/client';
import { Button } from '@UI/button';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { CheckCircleIcon, ChevronRightIcon } from 'lucide-react';
import BigNumber from 'bignumber.js';

export interface InvitedFriendProps {
  id: string;
  name: string;
  claimedPoints: number;
  pendingPoints: number;
}

export interface TaskProps {
  id: string;
  iconSrc: StaticImageData;
  title: string;
  rewardsDescription: string;
  pointsEarned: number;
  actionButton: React.ReactNode;
}

const MOCK_INVITED_FRIENDS: InvitedFriendProps[] = [
  { id: '0', name: 'Degen 1', claimedPoints: 200, pendingPoints: 100 },
  { id: '1', name: 'Degen 2', claimedPoints: 400, pendingPoints: 0 },
  { id: '2', name: 'Degen 3', claimedPoints: 0, pendingPoints: 300 },
  { id: '3', name: 'Degen 4', claimedPoints: 0, pendingPoints: 200 },
  { id: '4', name: 'Degen 5', claimedPoints: 0, pendingPoints: 0 },
];

export const usePointsSources = () => {
  const { t } = useTranslation({ ns: 'rewards' });
  const { push } = useRouter();

  const [referralModalIsOpen, setReferralModalIsOpen] = useState(false);
  const openReferralModal = useCallback(() => setReferralModalIsOpen(true), []);
  const closeReferralModal = useCallback(() => setReferralModalIsOpen(false), []);

  // TODO: replace with real data
  const tasks = useMemo<TaskProps[]>(() => {
    return [
      {
        id: '1',
        iconSrc: depositLiquiditySrc,
        title: t('deposit_liquidity'),
        rewardsDescription: t('deposit_liquidity_rewards_description'),
        pointsEarned: 0,
        actionButton: <Button onClick={() => push('/')}>{t('deposit')}</Button>,
      },
      {
        id: '2',
        iconSrc: addPersonSrc,
        title: t('invite_friends'),
        rewardsDescription: t('invite_friends_rewards_description'),
        pointsEarned: 5000 * MOCK_INVITED_FRIENDS.length,
        actionButton: <Button onClick={openReferralModal}>{t('invite')}</Button>,
      },
      {
        id: '3',
        iconSrc: telegramSrc,
        title: t('join_channel'),
        rewardsDescription: t('join_channel_rewards_description'),
        pointsEarned: 0,
        actionButton: (
          <a href='https://t.me/parraton_en' target='_blank' rel='noreferrer'>
            <ChevronRightIcon className='h-5 w-auto' />
          </a>
        ),
      },
      {
        id: '4',
        iconSrc: telegramSrc,
        title: t('explore_telegram_apps'),
        rewardsDescription: t('explore_telegram_apps_rewards_description'),
        pointsEarned: 1000,
        actionButton: <CheckCircleIcon className='h-5 w-auto text-green-500' />,
      },
    ];
  }, [openReferralModal, push, t]);

  const totalPointsEarned = useMemo(
    () =>
      BigNumber.sum(
        ...tasks.map(({ pointsEarned }) => pointsEarned),
        ...MOCK_INVITED_FRIENDS.map(({ claimedPoints }) => claimedPoints),
      ).toNumber(),
    [tasks],
  );

  const claimFriendRewards = useCallback((friendId: string) => {
    console.log('Claiming rewards for friend with id:', friendId);
  }, []);

  return {
    invitedFriends: MOCK_INVITED_FRIENDS,
    tasks,
    totalPointsEarned,
    referralModalIsOpen,
    claimFriendRewards,
    openReferralModal,
    closeReferralModal,
  };
};
