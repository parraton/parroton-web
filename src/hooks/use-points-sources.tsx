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
import { QuestsApi } from '@core/quests-api';
import { useStorage } from './use-storage';
import { CheckCircledIcon } from '@radix-ui/react-icons';
import { ActionLink } from '@components/rewards/action-link';
import { ClaimButton } from '@components/rewards/claim-button';

export interface InvitedFriendProps {
  id: string;
  name: string;
  claimedPoints: number;
  pendingPoints: number;
}

export interface QuestProps {
  id: string;
  iconSrc: StaticImageData;
  title: string;
  rewardsDescription: string;
  actionButton: React.ReactNode;
}

const REFERRAL_REWARD_PERCENTAGE = 5;
const FOLLOWED_LINKS_STORAGE_KEY = 'followed-links';

export const usePointsSources = () => {
  const { getItem, setItem } = useStorage();
  const [, initData] = useInitData();
  const { t, lng } = useTranslation({ ns: 'rewards' });
  const { push } = useRouter();

  const getFollowedLinks = useCallback(async (): Promise<string[]> => {
    try {
      const maybeItems = JSON.parse((await getItem(FOLLOWED_LINKS_STORAGE_KEY)) || '[]');

      if (Array.isArray(maybeItems) && maybeItems.every((item) => typeof item === 'string')) {
        return maybeItems;
      }

      throw new Error('Invalid data');
    } catch {
      setItem(FOLLOWED_LINKS_STORAGE_KEY, '[]').catch(console.error);

      return [];
    }
  }, [getItem, setItem]);
  const { data: followedLinks, mutate: mutateFollowedLinks } = useSWR(
    'followed-links',
    getFollowedLinks,
    {
      suspense: false,
      shouldRetryOnError: true,
    },
  );

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
  const {
    data: questsData,
    error: questsDataError,
    mutate: mutateQuestsData,
  } = useSWR(['rewards-quests-data', initData], () => (api ? api.getQuests() : null), {
    refreshInterval: 10_000,
    suspense: false,
    shouldRetryOnError: true,
  });
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

  const claimQuestReward = useCallback(
    async (questId: string) => {
      if (!api) {
        return;
      }

      try {
        await api.claimQuest(questId);
        await Promise.all([mutateQuestsData(), mutateUserData()]);
      } catch (error) {
        console.error(error);
      }
    },
    [api, mutateQuestsData, mutateUserData],
  );

  const handleActionLinkClick = useCallback(
    async (link: string) => {
      try {
        const newFollowedLinks = [...(followedLinks ?? []), link];
        await setItem(FOLLOWED_LINKS_STORAGE_KEY, JSON.stringify(newFollowedLinks));
        await mutateFollowedLinks(newFollowedLinks);
      } catch (error) {
        console.error(error);
      }
    },
    [followedLinks, mutateFollowedLinks, setItem],
  );

  // TODO: modify frontend and backend to remove hardcoding icons
  const quests = useMemo(() => {
    if (!questsData || !followedLinks) {
      return;
    }

    return questsData.map<QuestProps>((quest) => {
      const { id, names, claimed } = quest;
      const basicProps = { id, title: names[lng] || names.en };

      switch (quest.type) {
        case 'deposit-liquidity': {
          return {
            ...basicProps,
            iconSrc: depositLiquiditySrc,
            rewardsDescription: t('deposit_liquidity_rewards_description'),
            actionButton: <Button onClick={() => push('/')}>{t('deposit')}</Button>,
          };
        }
        case 'invite-friends': {
          return {
            ...basicProps,
            iconSrc: addPersonSrc,
            rewardsDescription: t('invite_friends_rewards_description'),
            actionButton: <Button onClick={openReferralModal}>{t('invite')}</Button>,
          };
        }
        case 'section-name': {
          return {
            ...basicProps,
            iconSrc: tappsSrc,
            rewardsDescription: '',
            actionButton: null,
          };
        }
        case 'follow-link': {
          return {
            ...basicProps,
            iconSrc: telegramSrc,
            rewardsDescription: t('one_time_rewards_description', { amount: quest.amount }),
            actionButton: claimed ? (
              <CheckCircledIcon className='h-5 w-auto text-green-500' />
            ) : followedLinks.includes(quest.link) ? (
              <ClaimButton questId={id} onClick={claimQuestReward} />
            ) : (
              <ActionLink
                link={quest.link}
                isTelegram={quest.isTelegramLink}
                onClick={handleActionLinkClick}
              >
                <ChevronRightIcon className='h-5 w-auto' />
              </ActionLink>
            ),
          };
        }
      }
    });
  }, [
    claimQuestReward,
    followedLinks,
    handleActionLinkClick,
    lng,
    openReferralModal,
    push,
    questsData,
    t,
  ]);

  const userDataLoading = userData === undefined && !userError;
  const referralsDataLoading = referralsData === undefined && !referralsDataError;
  const invitedFriendsLoading = userDataLoading || referralsDataLoading;
  const questsLoading = !followedLinks || (questsData === undefined && !questsDataError);

  // TODO: implement claiming rewards by a friend after the backend is ready
  const claimFriendRewards = useCallback(async () => {
    if (!api) {
      return;
    }

    try {
      await api.claimReferrals();
      await Promise.all([mutateReferralsData(), mutateUserData()]);
    } catch (error) {
      console.error(error);
    }
  }, [api, mutateReferralsData, mutateUserData]);

  return {
    totalPointsEarned: userData?.balance,
    userDataLoading,
    isTelegram: Boolean(initData),
    invitedFriends,
    invitedFriendsLoading,
    quests,
    questsLoading,
    referralModalIsOpen,
    claimFriendRewards,
    openReferralModal,
    closeReferralModal,
  };
};
