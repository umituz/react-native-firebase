/**
 * Firebase Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

import type { InitModule } from '@umituz/react-native-design-system/init';
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
  const { authInitializer, critical = true } = config;

  return {
    name: 'firebase',
    critical,
    init: async () => {
      try {
        const result = await initializeAllFirebaseServices(undefined, {
          authInitializer: authInitializer ?? (() => Promise.resolve()),
        });

        if (!result.app) {
          const errorMsg = 'Firebase configuration not found. Please set EXPO_PUBLIC_FIREBASE_* environment variables.';
          if (__DEV__) {
            console.error(`[Firebase] ${errorMsg}`);
          }
          // In production, this is a critical error
          if (critical) {
            throw new Error(errorMsg);
          }
          return false;
        }

        if (result.auth === false && result.authError) {
          const errorMsg = `Auth initialization failed: ${result.authError}`;
          if (__DEV__) {
            console.error(`[Firebase] ${errorMsg}`);
          }
          // Auth failure is critical for apps that require authentication
          if (critical && authInitializer) {
            throw new Error(errorMsg);
          }
        }

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown Firebase initialization error';
        if (__DEV__) {
          console.error(`[Firebase] Initialization failed: ${errorMessage}`);
        }
        // Re-throw in production if this is a critical module
        if (critical) {
          throw error;
        }
        return false;
      }
    },
  };
}
