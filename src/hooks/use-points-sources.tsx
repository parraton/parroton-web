import React, { useCallback, useMemo, useRef, useState } from 'react';

import AddPersonImgData from '../images/add-person.png';
import RainbowImgData from '../images/rainbowswap.png';
import TelegramImgData from '../images/telegram.png';
import XComImgData from '../images/x-icon.png';
import ChessioImgData from '../images/chessio.png';
import { useTranslation } from '@i18n/client';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon } from 'lucide-react';
import { useInitData } from '@vkruglikov/react-telegram-web-app';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { QuestsApi } from '@core/quests-api';
import { useStorage } from './use-storage';
import { ActionLink } from '@components/rewards/action-link';
import { LEVELS_THRESHOLDS } from '@lib/constants';
import { ActionButton } from '@components/rewards/action-button';
import { CheckIcon } from '@components/icons/check-icon';
import { useCopyReferralLink } from './use-copy-referral-link';
import { toast } from 'sonner';

export interface InvitedFriendProps {
  id: string;
  name: string;
  claimedPoints: number;
  pendingPoints: number;
}

export interface QuestProps {
  id: string;
  iconSrc?: StaticImageData;
  title: string;
  rewardsDescription: string;
  actionButton: React.ReactNode;
  isSectionName?: boolean;
}

const REFERRAL_REWARD_PERCENTAGE = 5;
const FOLLOWED_LINKS_STORAGE_KEY = 'followed-links';

const domainsLinksImgData: Record<string, StaticImageData | undefined> = {
  't.me': TelegramImgData,
  'x.com': XComImgData,
};

const sectionsImgData: Record<string, StaticImageData | undefined> = {
  chessio: ChessioImgData,
  rainbowswap: RainbowImgData,
};

export const usePointsSources = () => {
  const [loadingQuestsIds, setLoadingQuestsIds] = useState<string[]>([]);
  const { getItem, setItem } = useStorage();
  const [, initData] = useInitData();
  const { t, lng } = useTranslation({ ns: 'rewards' });
  const { push } = useRouter();

  const onAfterCopy = useCallback(() => toast.success(t('link_copied')), [t]);
  const { link: webAppLink, copyLink: copyWebAppLink } = useCopyReferralLink(false, onAfterCopy);
  const { link: miniAppLink, copyLink: copyMiniAppLink } = useCopyReferralLink(true, onAfterCopy);
  const copyRefLink = miniAppLink ? copyMiniAppLink : copyWebAppLink;
  const refLink = miniAppLink ?? webAppLink;
  const hiddenShareAnchorRef = useRef<HTMLAnchorElement>(null);
  const hiddenAnchorHref = useMemo(() => {
    const url = new URL('https://t.me/share/url');
    url.searchParams.set('url', refLink ?? '');
    url.searchParams.set('text', 'TODO: add some motivational text here');

    return url.href;
  }, [refLink]);

  const shareLink = useCallback(() => {
    if (!refLink) {
      return;
    }

    if (initData) {
      hiddenShareAnchorRef.current?.click();
    } else {
      window.navigator.share({ url: refLink }).catch(console.error);
    }
  }, [initData, refLink]);

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
    async (link: string, questId: string) => {
      setLoadingQuestsIds((ids) => [...ids, questId]);
      if (followedLinks?.includes(link)) {
        await claimQuestReward(questId);
      }

      try {
        const newFollowedLinks = [...(followedLinks ?? []), link];
        await setItem(FOLLOWED_LINKS_STORAGE_KEY, JSON.stringify(newFollowedLinks));
        await mutateFollowedLinks(newFollowedLinks);
      } catch (error) {
        console.error(error);
      }
      setLoadingQuestsIds((ids) => ids.filter((id) => id !== questId));
    },
    [claimQuestReward, followedLinks, mutateFollowedLinks, setItem],
  );

  // TODO: modify frontend and backend to remove hardcoding icons
  const quests = useMemo(() => {
    if (!questsData || !followedLinks) {
      return;
    }

    return questsData
      .map<QuestProps | null>((quest) => {
        const { id, name, claimed } = quest;
        const basicProps = { id, title: name[lng] || name.en };

        switch (quest.type) {
          case 'deposit-liquidity': {
            return {
              ...basicProps,
              iconSrc: RainbowImgData,
              rewardsDescription: t('deposit_liquidity_rewards_description'),
              actionButton: <ActionButton onClick={() => push('/')}>{t('deposit')}</ActionButton>,
            };
          }
          case 'invite-friends': {
            return {
              ...basicProps,
              iconSrc: AddPersonImgData,
              rewardsDescription: t('invite_friends_rewards_description'),
              actionButton: (
                <ActionButton onClick={copyRefLink} onDoubleClick={shareLink}>
                  {t('invite')}
                </ActionButton>
              ),
            };
          }
          case 'section-name': {
            return {
              ...basicProps,
              iconSrc: sectionsImgData[quest.id],
              rewardsDescription: '',
              actionButton: null,
              isSectionName: true,
            };
          }
          case 'follow-link': {
            const linkDomain = new URL(quest.link).hostname;

            return {
              ...basicProps,
              iconSrc: domainsLinksImgData[linkDomain],
              rewardsDescription: t('one_time_rewards_description', { amount: quest.reward }),
              actionButton: claimed ? (
                <CheckIcon className='h-5 w-auto fill-current text-green-500' />
              ) : (
                <ActionLink
                  link={quest.link}
                  questId={id}
                  loading={loadingQuestsIds.includes(id)}
                  isTelegram={quest.isTelegramLink}
                  onClick={handleActionLinkClick}
                >
                  <ChevronRightIcon className='h-5 w-auto' />
                </ActionLink>
              ),
            };
          }
          default: {
            return null;
          }
        }
      })
      .filter((x): x is QuestProps => x !== null);
  }, [
    copyRefLink,
    followedLinks,
    handleActionLinkClick,
    lng,
    loadingQuestsIds,
    push,
    questsData,
    shareLink,
    t,
  ]);

  const userDataLoading = userData === undefined && !userError;
  const referralsDataLoading = referralsData === undefined && !referralsDataError;
  const invitedFriendsLoading = userDataLoading || referralsDataLoading;
  const questsLoading = !followedLinks || (questsData === undefined && !questsDataError);

  const totalPointsEarned = userData?.balance;
  const userLevel = useMemo(() => {
    if (totalPointsEarned === undefined) {
      return;
    }

    if (totalPointsEarned < LEVELS_THRESHOLDS[0]) {
      return 1;
    }

    if (totalPointsEarned >= LEVELS_THRESHOLDS.at(-1)!) {
      return LEVELS_THRESHOLDS.length + 1;
    }

    for (let i = 0; i < LEVELS_THRESHOLDS.length - 1; i++) {
      if (
        totalPointsEarned >= LEVELS_THRESHOLDS[i] &&
        totalPointsEarned < LEVELS_THRESHOLDS[i + 1]
      ) {
        return i + 2;
      }
    }
  }, [totalPointsEarned]);

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
    userLevel,
    totalPointsEarned,
    userDataLoading,
    isTelegram: Boolean(initData),
    invitedFriends,
    invitedFriendsLoading,
    quests,
    questsLoading,
    claimFriendRewards,
    hiddenShareAnchorRef,
    hiddenAnchorHref,
  };
};
