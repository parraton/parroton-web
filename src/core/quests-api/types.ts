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

interface QuestBase {
  type: string;
  id: string;
  name: string;
  reward: number;
  started: boolean;
  claimed: boolean;
}

interface InviteFriendsQuest extends QuestBase {
  type: 'invite-friends';
  friendsRequired: number;
}

interface SocialMediaQuest extends QuestBase {
  type: 'social-media';
  id: 'follow-on-x' | 'retweet-on-x';
}

export type Quest = InviteFriendsQuest | SocialMediaQuest;

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
