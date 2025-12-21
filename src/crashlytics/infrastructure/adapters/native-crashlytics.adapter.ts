/**
 * Native Crashlytics Adapter
 * Single Responsibility: Handle Firebase Crashlytics native implementation
 * Uses React Native Firebase v23+ modular API
 */

import {
  getCrashlytics,
  log,
  recordError,
  setAttribute,
} from '@react-native-firebase/crashlytics';

export interface CrashlyticsInstance {
  // Instance is now opaque - methods are called via modular functions
}

export interface NativeCrashlyticsAdapter {
  getCrashlytics(): CrashlyticsInstance;
  setUserId(crashlytics: CrashlyticsInstance, userId: string): Promise<void>;
  setAttributes(crashlytics: CrashlyticsInstance, attributes: Record<string, string>): Promise<void>;
  recordError(crashlytics: CrashlyticsInstance, error: Error): Promise<void>;
  log(crashlytics: CrashlyticsInstance, message: string): Promise<void>;
}

export const nativeCrashlyticsAdapter: NativeCrashlyticsAdapter = {
  getCrashlytics(): CrashlyticsInstance {
    return getCrashlytics() as CrashlyticsInstance;
  },
  async setUserId(crashlytics: CrashlyticsInstance, userId: string): Promise<void> {
    try {
      // Note: setUserId is a method on the crashlytics instance, not a modular function
      await (crashlytics as any).setUserId(userId);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to set user ID:', error);
      }
    }
  },
  async setAttributes(
    crashlytics: CrashlyticsInstance,
    attributes: Record<string, string>,
  ): Promise<void> {
    try {
      // Set each attribute individually using the modular API
      for (const [key, value] of Object.entries(attributes)) {
        await setAttribute(crashlytics, key, value);
      }
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to set attributes:', error);
      }
    }
  },
  async recordError(crashlytics: CrashlyticsInstance, error: Error): Promise<void> {
    try {
      await recordError(crashlytics, error);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to record error:', err);
      }
    }
  },
  async log(crashlytics: CrashlyticsInstance, message: string): Promise<void> {
    try {
      await log(crashlytics, message);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to log message:', error);
      }
    }
  },
};
