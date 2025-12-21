/**
 * Native Crashlytics Adapter
 * Single Responsibility: Handle Firebase Crashlytics native implementation
 * Uses React Native Firebase v23+ modular API
 *
 * NOTE: This adapter uses optional import to support Expo Go.
 * Native modules are only available in development builds or standalone apps.
 */

// Optional import - will be null in Expo Go
let nativeCrashlytics: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  nativeCrashlytics = require('@react-native-firebase/crashlytics');
} catch {
  // Native module not available (e.g., Expo Go)
  // Silent fail - crashlytics is optional
}

export type CrashlyticsInstance = any;

export interface NativeCrashlyticsAdapter {
  getCrashlytics(): CrashlyticsInstance;
  setUserId(crashlytics: CrashlyticsInstance, userId: string): Promise<void>;
  setAttributes(crashlytics: CrashlyticsInstance, attributes: Record<string, string>): Promise<void>;
  recordError(crashlytics: CrashlyticsInstance, error: Error): Promise<void>;
  log(crashlytics: CrashlyticsInstance, message: string): Promise<void>;
}

declare const __DEV__: boolean;

export const nativeCrashlyticsAdapter: NativeCrashlyticsAdapter | null = nativeCrashlytics
  ? {
      getCrashlytics(): CrashlyticsInstance {
        return nativeCrashlytics.getCrashlytics();
      },
      async setUserId(crashlytics: CrashlyticsInstance, userId: string): Promise<void> {
        try {
          await nativeCrashlytics.setUserId(crashlytics, userId);
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
            await nativeCrashlytics.setAttribute(crashlytics, key, value);
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
          await nativeCrashlytics.recordError(crashlytics, error);
        } catch (err) {
          /* eslint-disable-next-line no-console */
          if (__DEV__) {
            console.warn('[Crashlytics] Failed to record error:', err);
          }
        }
      },
      async log(crashlytics: CrashlyticsInstance, message: string): Promise<void> {
        try {
          await nativeCrashlytics.log(crashlytics, message);
        } catch (error) {
          /* eslint-disable-next-line no-console */
          if (__DEV__) {
            console.warn('[Crashlytics] Failed to log message:', error);
          }
        }
      },
    }
  : null;
