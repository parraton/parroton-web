import React, { useCallback, useMemo, useState } from 'react';

import addPersonSrc from '../images/add-person.png';
import depositLiquiditySrc from '../images/deposit-liquidity.png';
import tappsSrc from '../images/tapps.png';
import telegramSrc from '../images/telegram.png';
import { useTranslation } from '@i18n/client';
import { Button } from '@UI/button';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import { useInitData } from '@vkruglikov/react-telegram-web-app';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { TelegramLinkButton } from '@components/rewards/telegram-link-button';
import { QuestsApi } from '@core/quests-api';

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
  actionButton: React.ReactNode;
}

const REFERRAL_REWARD_PERCENTAGE = 5;

export const usePointsSources = () => {
  const [, initData] = useInitData();
  const { t } = useTranslation({ ns: 'rewards' });
  const { push } = useRouter();

  const api = useMemo(() => (initData ? new QuestsApi(initData) : null), [initData]);
  const {
    data: userData,
    error: userError,
    mutate: mutateUserData,
  } = useSWR(['rewards-user-data', initData], () => (api ? api.getUser() : null), {
    refreshInterval: 10_000,
    suspense: false,
    shouldRetryOnError: true,
  });
  // TODO: use it after the backend returns appropriate data
  /* const {
    data: questsData,
    error: questsDataError,
    mutate: mutateQuestsData,
  } = useSWR(
    ['rewards-quests-data', initData],
    () => (api ? api.getQuests() : null),
    {
      refreshInterval: 10_000,
      suspense: false,
      shouldRetryOnError: true,
    },
  ); */
  const {
    data: referralsData,
    error: referralsDataError,
    mutate: mutateReferralsData,
  } = useSWR(['rewards-referrals-data', initData], () => (api ? api.getReferrals() : null), {
    refreshInterval: 10_000,
    suspense: false,
    shouldRetryOnError: true,
  });
  // TODO: reimplement this logic after claiming rewards by a friend is implemented on the backend
  const friendRewardsStub = useMemo(() => {
    if (!userData || !referralsData) {
      return;
    }

    let totalClaimedRefRewards = userData.claimedReferralReward;

    return referralsData.map((ref) => {
      const totalRefRewards = new BigNumber(ref.balance).times(REFERRAL_REWARD_PERCENTAGE).div(100);
      const refClaimedRewards = BigNumber.min(totalClaimedRefRewards, totalRefRewards);
      totalClaimedRefRewards -= refClaimedRewards.toNumber();

      return {
        claimed: refClaimedRewards.toNumber(),
        pending: totalRefRewards.minus(refClaimedRewards).toNumber(),
      };
    });
  }, [referralsData, userData]);
  const invitedFriends = useMemo(() => {
    if (!friendRewardsStub || !referralsData) {
      return;
    }

    return referralsData.map<InvitedFriendProps>((ref, i) => ({
      id: ref.id,
      name:
        (ref.firstName ? [ref.firstName, ref.lastName].filter(Boolean).join(' ') : ref.username) ??
        '???',
      claimedPoints: friendRewardsStub[i].claimed ?? 0,
      pendingPoints: friendRewardsStub[i].pending ?? 0,
    }));
  }, [friendRewardsStub, referralsData]);

  const [referralModalIsOpen, setReferralModalIsOpen] = useState(false);
  const openReferralModal = useCallback(() => setReferralModalIsOpen(true), []);
  const closeReferralModal = useCallback(() => setReferralModalIsOpen(false), []);

  // TODO: add logic for claiming and marking quests as completed
  const tasks = useMemo<TaskProps[]>(() => {
    return [
      {
        id: '1',
        iconSrc: depositLiquiditySrc,
        title: t('deposit_liquidity'),
        rewardsDescription: t('deposit_liquidity_rewards_description'),
        actionButton: <Button onClick={() => push('/')}>{t('deposit')}</Button>,
      },
      {
        id: '2',
        iconSrc: addPersonSrc,
        title: t('invite_friends'),
        rewardsDescription: t('invite_friends_rewards_description'),
        actionButton: <Button onClick={openReferralModal}>{t('invite')}</Button>,
      },
      {
        id: '3',
        iconSrc: telegramSrc,
        title: t('join_channel'),
        rewardsDescription: t('join_parraton_channel_rewards_description'),
        actionButton: (
          <TelegramLinkButton link='https://t.me/parraton_en'>
            <ChevronRightIcon className='h-5 w-auto' />
          </TelegramLinkButton>
        ),
      },
      {
        id: 'dummy-1',
        iconSrc: tappsSrc,
        title: 'Telegram Apps Center',
        rewardsDescription: '',
        actionButton: null,
      },
      {
        id: '4',
        iconSrc: telegramSrc,
        title: t('join_channel'),
        rewardsDescription: t('join_tapps_channel_rewards_description'),
        actionButton: (
          <TelegramLinkButton link='https://t.me/trendingapps'>
            <ChevronRightIcon className='h-5 w-auto' />
          </TelegramLinkButton>
        ),
      },
      {
        id: '5',
        iconSrc: telegramSrc,
        title: t('explore_telegram_apps'),
        rewardsDescription: t('explore_telegram_apps_rewards_description'),
        actionButton: (
          <TelegramLinkButton link='https://t.me/tapps_bot?profile'>
            <ChevronRightIcon className='h-5 w-auto' />
          </TelegramLinkButton>
        ),
      },
    ];
  }, [openReferralModal, push, t]);

  const userDataLoading = userData === undefined && !userError;
  const referralsDataLoading = referralsData === undefined && !referralsDataError;
  const invitedFriendsLoading = userDataLoading || referralsDataLoading;

  // TODO: implement claiming rewards by a friend after the backend is ready
  const claimFriendRewards = useCallback(async () => {
    if (!api) {
      return;
    }

    await api.claimReferrals();
    await Promise.all([mutateReferralsData(), mutateUserData()]);
  }, [api, mutateReferralsData, mutateUserData]);

  return {
    totalPointsEarned: userData?.balance,
    userDataLoading,
    isTelegram: Boolean(initData),
    invitedFriends,
    invitedFriendsLoading,
    tasks,
    referralModalIsOpen,
    claimFriendRewards,
    openReferralModal,
    closeReferralModal,
  };
};
