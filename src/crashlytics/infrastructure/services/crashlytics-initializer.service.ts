/**
 * Crashlytics Initializer Service
 * Single Responsibility: Handle Crashlytics initialization logic
 */

import { nativeCrashlyticsAdapter } from '../adapters/native-crashlytics.adapter';
import type { CrashlyticsInstance } from '../adapters/native-crashlytics.adapter';

export class CrashlyticsInitializerService {
  /**
   * Initialize Crashlytics instance
   * Returns null if Crashlytics is not available (e.g., on web)
   */
  initialize(): CrashlyticsInstance | null {
    if (!nativeCrashlyticsAdapter) {
      return null;
    }

    try {
      return nativeCrashlyticsAdapter.getCrashlytics();
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Initialization failed:', error);
      }
      return null;
    }
  }
}

export const crashlyticsInitializerService = new CrashlyticsInitializerService();
