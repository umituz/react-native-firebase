/**
 * Crashlytics Error Service
 * Single Responsibility: Handle error logging operations
 */

import { nativeCrashlyticsAdapter } from '../adapters/native-crashlytics.adapter';
import type { CrashlyticsInstance } from '../adapters/native-crashlytics.adapter';

export class CrashlyticsErrorService {
  /**
   * Log error to Crashlytics
   */
  async logError(
    crashlytics: CrashlyticsInstance | null,
    error: Error,
    context?: string,
  ): Promise<void> {
    try {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.error(`[Crashlytics] Error${context ? ` in ${context}` : ''}:`, error);
      }

      if (!crashlytics || !nativeCrashlyticsAdapter) {
        return;
      }

      if (context) {
        await nativeCrashlyticsAdapter.log(crashlytics, `Context: ${context}`);
      }
      await nativeCrashlyticsAdapter.log(
        crashlytics,
        `Error: ${error.name} - ${error.message}`,
      );
      await nativeCrashlyticsAdapter.recordError(crashlytics, error);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to log error:', err);
      }
    }
  }

  /**
   * Log message to Crashlytics
   */
  async log(crashlytics: CrashlyticsInstance | null, message: string): Promise<void> {
    try {
      if (!crashlytics || !nativeCrashlyticsAdapter) {
        /* eslint-disable-next-line no-console */
        if (__DEV__) {
          console.log(`[Crashlytics] ${message}`);
        }
        return;
      }

      await nativeCrashlyticsAdapter.log(crashlytics, message);
    } catch (err) {
      /* eslint-disable-next-line no-console */
      if (__DEV__) {
        console.warn('[Crashlytics] Failed to log message:', err);
      }
    }
  }
}

export const crashlyticsErrorService = new CrashlyticsErrorService();
