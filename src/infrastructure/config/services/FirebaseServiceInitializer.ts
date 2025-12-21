/**
 * Firebase Service Initializer
 * Handles initialization of Firebase services (Analytics, Crashlytics)
 *
 * NOTE: Auth initialization is handled by the main app via callback.
 * This removes the need for dynamic require() which causes issues in production.
 *
 * Single Responsibility: Only initializes Firebase services
 */

import { firebaseAnalyticsService } from '../../../analytics';
import { firebaseCrashlyticsService } from '../../../crashlytics';

declare const __DEV__: boolean;

export type AuthInitializer = () => unknown;

export interface ServiceInitializationOptions {
  authInitializer?: AuthInitializer;
}

export interface ServiceInitializationResult {
  auth: unknown;
  analytics: typeof firebaseAnalyticsService;
  crashlytics: typeof firebaseCrashlyticsService;
}

export class FirebaseServiceInitializer {
  static async initializeServices(
    options?: ServiceInitializationOptions
  ): Promise<ServiceInitializationResult> {
    if (__DEV__) {
      console.log('[Firebase] Initializing services...');
    }

    let auth: unknown = null;
    if (options?.authInitializer) {
      try {
        auth = options.authInitializer();
        if (__DEV__) {
          console.log('[Firebase] Auth initialized via callback');
        }
      } catch (error) {
        if (__DEV__) {
          console.warn(
            '[Firebase] Auth initialization failed:',
            error instanceof Error ? error.message : 'Unknown error'
          );
        }
      }
    }

    const analytics = firebaseAnalyticsService;
    const crashlytics = firebaseCrashlyticsService;

    if (__DEV__) {
      console.log(
        '[Firebase] Services initialized - Auth:',
        !!auth,
        'Analytics:',
        !!analytics,
        'Crashlytics:',
        !!crashlytics
      );
    }

    return { auth, analytics, crashlytics };
  }
}
