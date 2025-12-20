/**
 * Crashlytics User Service
 * Single Responsibility: Handle user-related Crashlytics operations
 */

import { nativeCrashlyticsAdapter } from '../adapters/native-crashlytics.adapter';
import type { CrashlyticsInstance } from '../adapters/native-crashlytics.adapter';

export class CrashlyticsUserService {
  /**
   * Set user ID
   */
  async setUserId(crashlytics: CrashlyticsInstance | null, userId: string): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setUserId(crashlytics, userId);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to set user ID:', err);
      }
    }
  }

  /**
   * Set attribute
   */
  async setAttribute(
    crashlytics: CrashlyticsInstance | null,
    key: string,
    value: string,
  ): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setAttributes(crashlytics, { [key]: value });
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to set attribute:', err);
      }
    }
  }

  /**
   * Set multiple attributes
   */
  async setAttributes(
    crashlytics: CrashlyticsInstance | null,
    attributes: Record<string, string>,
  ): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setAttributes(crashlytics, attributes);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to set attributes:', err);
      }
    }
  }

  /**
   * Clear user data
   */
  async clearUserData(crashlytics: CrashlyticsInstance | null): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      await nativeCrashlyticsAdapter.setUserId(crashlytics, '');
      await nativeCrashlyticsAdapter.setAttributes(crashlytics, {});
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to clear user data:', err);
      }
    }
  }
}

export const crashlyticsUserService = new CrashlyticsUserService();
