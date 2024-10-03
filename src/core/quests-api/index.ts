import { QUESTS_API_URL } from '@config/api.config';
import { AdsQuest, Quest, User } from './types';

export type { User, Quest, AdsQuest } from './types';

const IS_DEV_ENV = process.env.NODE_ENV === 'development';

export class QuestsApi {
  get url() {
    return `${QUESTS_API_URL}/${this.apiVersion}`;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars,no-unused-vars */
  constructor(
    private authString: string,
    private apiVersion: string = 'v1',
  ) {}
  /* eslint-enable @typescript-eslint/no-unused-vars,no-unused-vars */

  getUser(): Promise<User> {
    return this.fetchJSON('/user');
  }

  postTaps(taps: number): Promise<{ balance: number }> {
    return this.fetchJSON('/taps', {
      method: 'POST',
      body: String(taps),
    });
  }

  getReferrals(): Promise<User[]> {
    return this.fetchJSON('/referrals');
  }

  claimReferrals(): Promise<void> {
    return this.fetchJSON('/referrals/claim', {
      method: 'POST',
    });
  }

  getQuests(): Promise<Quest[]> {
    return this.fetchJSON('/quests');
  }

  async startQuest(questId: string) {
    await this.fetch(`/quests/${questId}/start`, {
      method: 'POST',
    });
  }

  claimQuest(questId: string): Promise<void> {
    return this.fetchJSON(`/quests/${questId}/claim`, {
      method: 'POST',
    });
  }

  getAdsQuestState(): Promise<AdsQuest> {
    return this.fetchJSON('/ads-quest/state');
  }

  claimAdsQuest(): Promise<void> {
    return this.fetchJSON(`/ads-quest/claim`, {
      method: 'POST',
    });
  }

  private async fetchJSON<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await this.fetch(path, options);

    if (!response.body) {
      throw new Error(`Failed to fetch JSON for ${path}`);
    }

    return response.json();
  }

  private async fetch(path: string, options: RequestInit = {}) {
    const fullUrl = `${this.url}${path}`;

    const headers = new Headers({
      Authorization: this.authString,
      ...options.headers,
    });

    if (!headers.has('Content-Type') && options.body != null)
      headers.set('Content-Type', 'application/json');

    // See: https://ngrok.com/docs/http/request-headers/#special-cases
    if (IS_DEV_ENV) headers.set('ngrok-skip-browser-warning', 'any-value');

    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    if (!response.ok) throw new Error(`Failed to fetch ${path}: ${response.statusText}`);

    return response;
  }
}
