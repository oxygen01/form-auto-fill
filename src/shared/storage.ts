import { FillOptions, Profile } from './types';
import { DEFAULT_OPTIONS, STORAGE_KEYS } from './constants';

export const storage = {
  async getOptions(): Promise<FillOptions> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.OPTIONS);
    return result[STORAGE_KEYS.OPTIONS] || DEFAULT_OPTIONS;
  },

  async setOptions(options: FillOptions): Promise<void> {
    await chrome.storage.sync.set({ [STORAGE_KEYS.OPTIONS]: options });
  },

  async getProfiles(): Promise<Profile[]> {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.PROFILES);
    return result[STORAGE_KEYS.PROFILES] || [];
  },

  async setProfiles(profiles: Profile[]): Promise<void> {
    await chrome.storage.sync.set({ [STORAGE_KEYS.PROFILES]: profiles });
  },
};
