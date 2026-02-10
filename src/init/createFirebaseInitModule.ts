/**
 * Firebase Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

import type { InitModule } from '@umituz/react-native-design-system';
import { initializeAllFirebaseServices } from '../infrastructure/config/FirebaseClient';

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

        // Check if initialization was successful
        if (!result.app) {
          console.error('[Firebase] Initialization failed: Firebase app not initialized');
          return false;
        }

        // Check if auth initialization failed
        if (result.auth === false && result.authError) {
          console.error(`[Firebase] Auth initialization failed: ${result.authError}`);
          // Auth failure is not critical for the app to function
          // Log the error but don't fail the entire initialization
        }

        return true;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Firebase] Initialization failed: ${errorMessage}`);
        return false;
      }
    },
  };
}
