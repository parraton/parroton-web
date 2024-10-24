import React, { useCallback, useMemo, useRef, useState } from 'react';

import AddPersonImgData from '../images/add-person.png';
import RainbowImgData from '../images/rainbowswap.png';
import NewRainbowImgData from '../images/new-rainbowswap.png';
import TelegramImgData from '../images/telegram.png';
import XComImgData from '../images/x-icon.png';
import ChessioImgData from '../images/chessio.png';
import { useTranslation } from '@i18n/client';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronRightIcon, LoaderCircleIcon } from 'lucide-react';
import { useInitData, useWebApp } from '@vkruglikov/react-telegram-web-app';
import useSWR from 'swr';
import BigNumber from 'bignumber.js';
import { QuestsApi } from '@core/quests-api';
import { LEVELS_THRESHOLDS } from '@lib/constants';
import { ActionButton } from '@components/rewards/action-button';
import { CheckIcon } from '@components/icons/check-icon';
import { useCopyReferralLink } from './use-copy-referral-link';
import { toast } from 'sonner';
import { Trans } from 'react-i18next';
import { useTypedStorageItem } from './use-typed-storage-item';
import { isStringArray } from '@lib/utils';

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
  rewardsDescription: React.ReactNode | React.ReactNode[];
  actionIcon: React.ReactNode;
  onClick?: () => void;
  onDoubleClick?: () => void;
  isSectionName?: boolean;
}

const REFERRAL_REWARD_PERCENTAGE = 5;
const FOLLOWED_LINKS_STORAGE_KEY = 'followed-links';
const FOLLOWED_LINKS_DEFAULT_VALUE: string[] = [];

const domainsLinksImgData: Record<string, StaticImageData | undefined> = {
  't.me': TelegramImgData,
  'x.com': XComImgData,
};

const sectionsImgData: Record<string, StaticImageData | undefined> = {
  chessio: ChessioImgData,
  rainbowswap: NewRainbowImgData,
};

export const usePointsSources = () => {
  const [loadingQuestsIds, setLoadingQuestsIds] = useState<string[]>([]);
  const [shouldRunConfetti, setShouldRunConfetti] = useState(false);
  const webApp = useWebApp();
  const [, initData] = useInitData();
  const { t, lng } = useTranslation({ ns: 'rewards' });
  const { push } = useRouter();

  const stopConfetti = useCallback(() => setShouldRunConfetti(false), []);

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

  const { value: followedLinks, setValue: setFollowedLinks } = useTypedStorageItem<string[]>(
    FOLLOWED_LINKS_STORAGE_KEY,
    FOLLOWED_LINKS_DEFAULT_VALUE,
    isStringArray,
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
        setShouldRunConfetti(true);
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
      } else {
        try {
          if (new URL(link).hostname === 't.me') {
            webApp.openTelegramLink(link);
          } else {
            webApp.openLink(link);
          }

          const newFollowedLinks = [...(followedLinks ?? []), link];
          await setFollowedLinks(newFollowedLinks);
        } catch (error) {
          console.error(error);
        }
      }
      setLoadingQuestsIds((ids) => ids.filter((id) => id !== questId));
    },
    [claimQuestReward, followedLinks, setFollowedLinks, webApp],
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
              actionIcon: <ActionButton>{t('deposit')}</ActionButton>,
              onClick: () => push('/'),
            };
          }
          case 'invite-friends': {
            return {
              ...basicProps,
              iconSrc: AddPersonImgData,
              rewardsDescription: t('invite_friends_rewards_description'),
              actionIcon: <ActionButton>{t('invite')}</ActionButton>,
              onClick: copyRefLink,
              onDoubleClick: shareLink,
            };
          }
          case 'section-name': {
            return {
              ...basicProps,
              iconSrc: sectionsImgData[quest.id],
              rewardsDescription: '',
              actionIcon: null,
              isSectionName: true,
            };
          }
          case 'follow-link': {
            const linkDomain = new URL(quest.link).hostname;
            const pointsMultiplier = quest.pointsMultiplier ?? 1;

            return {
              ...basicProps,
              iconSrc: domainsLinksImgData[linkDomain],
              rewardsDescription:
                pointsMultiplier === 1 ? (
                  t('one_time_rewards_description', { amount: quest.reward })
                ) : (
                  <Trans
                    i18nKey='rewards:one_time_with_multiplier_rewards_description'
                    values={{ amount: quest.reward / pointsMultiplier, newAmount: quest.reward }}
                    components={{
                      1: <span className='line-through' />,
                      2: <span className='rounded-sm bg-custom-button px-1 text-black' />,
                    }}
                  />
                ),
              actionIcon: claimed ? (
                <CheckIcon className='h-5 w-auto fill-current text-green-500' />
              ) : loadingQuestsIds.includes(id) ? (
                <LoaderCircleIcon size={20} className='animate-spin text-custom-primary-text' />
              ) : (
                <ChevronRightIcon className='h-5 w-auto text-custom-primary-text' />
              ),
              onClick: () => handleActionLinkClick(quest.link, id),
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
  const { userLevel, levelProgress } = useMemo(() => {
    if (totalPointsEarned === undefined) {
      return { userLevel: undefined, levelProgress: undefined };
    }

    if (totalPointsEarned < LEVELS_THRESHOLDS[0]) {
      return { userLevel: 1, levelProgress: totalPointsEarned / LEVELS_THRESHOLDS[0] };
    }

    for (let i = 0; i < LEVELS_THRESHOLDS.length - 1; i++) {
      if (
        totalPointsEarned >= LEVELS_THRESHOLDS[i] &&
        totalPointsEarned < LEVELS_THRESHOLDS[i + 1]
      ) {
        return {
          userLevel: i + 2,
          levelProgress:
            (totalPointsEarned - LEVELS_THRESHOLDS[i]) /
            (LEVELS_THRESHOLDS[i + 1] - LEVELS_THRESHOLDS[i]),
        };
      }
    }

    return { userLevel: LEVELS_THRESHOLDS.length + 1, levelProgress: 1 };
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
    levelProgress,
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
    shouldRunConfetti,
    stopConfetti,
  };
};
