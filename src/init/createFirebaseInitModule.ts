/**
 * Firebase Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

import type { InitModule } from '@umituz/react-native-design-system';
import { initializeAllFirebaseServices } from '../shared/infrastructure/config/services/FirebaseInitializationService';

export interface FirebaseInitModuleConfig {
  /**
   * Custom auth initializer function
   * @default () => initializeFirebaseAuth()
   */
  authInitializer?: () => Promise<void>;

  /**
   * Whether this module is critical for app startup
   * @default true
   */
  critical?: boolean;
}

/**
 * Creates a Firebase initialization module for use with createAppInitializer
 *
 * @example
 * ```typescript
 * import { createAppInitializer } from "@umituz/react-native-design-system";
 * import { createFirebaseInitModule } from "@umituz/react-native-firebase";
 *
 * export const initializeApp = createAppInitializer({
 *   modules: [
 *     createFirebaseInitModule(),
 *     // ... other modules
 *   ],
 * });
 * ```
 */
export function createFirebaseInitModule(
  config: FirebaseInitModuleConfig = {}
): InitModule {
  const { authInitializer, critical = false } = config;

  return {
    name: 'firebase',
    critical,
    init: async () => {
      try {
        const result = await initializeAllFirebaseServices(undefined, {
          authInitializer: authInitializer ?? (() => Promise.resolve()),
        });

        if (!result.app) {
          if (__DEV__) {
            console.warn('[Firebase] Firebase config not found or invalid — skipping initialization. Set EXPO_PUBLIC_FIREBASE_* env vars to enable.');
          }
          return false;
        }

        if (result.auth === false && result.authError) {
          if (__DEV__) {
            console.warn(`[Firebase] Auth initialization skipped: ${result.authError}`);
          }
        }

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        if (__DEV__) {
          console.warn(`[Firebase] Initialization skipped: ${errorMessage}`);
        }
        return false;
      }
    },
  };
}
