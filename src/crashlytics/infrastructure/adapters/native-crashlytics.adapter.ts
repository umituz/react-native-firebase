/**
 * Native Crashlytics Adapter
 * Single Responsibility: Handle Firebase Crashlytics native implementation
 */

export interface CrashlyticsInstance {
  setUserId(userId: string): Promise<void>;
  setAttributes(attributes: Record<string, string>): Promise<void>;
  recordError(error: Error): Promise<void>;
  log(message: string): Promise<void>;
}

export interface NativeCrashlyticsAdapter {
  getCrashlytics(): CrashlyticsInstance;
  setUserId(crashlytics: CrashlyticsInstance, userId: string): Promise<void>;
  setAttributes(crashlytics: CrashlyticsInstance, attributes: Record<string, string>): Promise<void>;
  recordError(crashlytics: CrashlyticsInstance, error: Error): Promise<void>;
  log(crashlytics: CrashlyticsInstance, message: string): Promise<void>;
}

interface NativeCrashlyticsModuleFunction {
  (): CrashlyticsInstance;
}

interface NativeCrashlyticsModuleObject {
  default: () => CrashlyticsInstance;
}

type NativeCrashlyticsModule = NativeCrashlyticsModuleFunction | NativeCrashlyticsModuleObject;

let nativeCrashlyticsModule: NativeCrashlyticsModule | null = null;
let isModuleLoaded = false;

function loadCrashlyticsModule(): void {
  if (isModuleLoaded) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@react-native-firebase/app');
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const crashlytics = require('@react-native-firebase/crashlytics');
    nativeCrashlyticsModule = crashlytics;
  } catch {
    // @react-native-firebase/crashlytics not available
  } finally {
    isModuleLoaded = true;
  }
}

function getCrashlyticsInstance(): CrashlyticsInstance | null {
  if (!isModuleLoaded) {
    loadCrashlyticsModule();
  }
  
  if (!nativeCrashlyticsModule) return null;

  try {
    if (typeof nativeCrashlyticsModule === 'function') {
      return nativeCrashlyticsModule();
    }
    if ('default' in nativeCrashlyticsModule && typeof nativeCrashlyticsModule.default === 'function') {
      return nativeCrashlyticsModule.default();
    }
  } catch (error) {
    /* eslint-disable-next-line no-console */
    if (__DEV__) {
      console.warn('[Crashlytics] Failed to get instance:', error);
    }
  }
  
  return null;
}

export const nativeCrashlyticsAdapter: NativeCrashlyticsAdapter | null = {
  getCrashlytics(): CrashlyticsInstance {
    const instance = getCrashlyticsInstance();
    if (!instance) {
      throw new Error('Crashlytics not initialized');
    }
    return instance;
  },
  async setUserId(crashlytics: CrashlyticsInstance, userId: string): Promise<void> {
    try {
      await crashlytics.setUserId(userId);
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
      await crashlytics.setAttributes(attributes);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to set attributes:', error);
      }
    }
  },
  async recordError(crashlytics: CrashlyticsInstance, error: Error): Promise<void> {
    try {
      await crashlytics.recordError(error);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to record error:', err);
      }
    }
  },
  async log(crashlytics: CrashlyticsInstance, message: string): Promise<void> {
    try {
      await crashlytics.log(message);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to log message:', error);
      }
    }
  },
};
