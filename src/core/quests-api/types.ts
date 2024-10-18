export interface User {
  id: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  languageCode?: string;
  balance: number;
  claimedReferralReward: number;
  claimedSinceCooldown: number;
  cooldownEnd: string;
  referrer?: string;
}

type QuestType = 'deposit-liquidity' | 'invite-friends' | 'follow-link' | 'section-name';

interface QuestBase {
  type: QuestType;
  id: string;
  /** Key is locale */
  name: Record<string, string>;
  claimed: boolean;
  started: boolean;
}

export interface EternalQuest extends QuestBase {
  type: 'deposit-liquidity' | 'invite-friends' | 'section-name';
}

interface FollowLinkQuest extends QuestBase {
  type: 'follow-link';
  link: string;
  isTelegramLink: boolean;
  reward: number;
  pointsMultiplier?: number;
}

export type Quest = EternalQuest | FollowLinkQuest;

export type AdsQuest =
  | {
      stage: 'initial';
      reward: number;
    }
  | {
      stage: 'x-times';
      times: number;
      /** Timestamp in ms */
      readyTime: number;
    }
  | {
      stage: 'cooling';
      /** Timestamp in ms */
      readyTime: number;
      initialReward: number;
    };
