/**
 * Firebase Init Module Factory
 * Creates a ready-to-use InitModule for app initialization
 */

import { initializeAllFirebaseServices } from '../infrastructure/config/FirebaseClient';
import { initializeFirebaseAuth } from '../auth/infrastructure/config/FirebaseAuthClient';

declare const __DEV__: boolean;

/**
 * InitModule interface (from @umituz/react-native-design-system)
 */
export interface InitModule {
  name: string;
  init: () => Promise<boolean>;
  critical?: boolean;
  dependsOn?: string[];
}

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
        await initializeAllFirebaseServices(undefined, {
          authInitializer: authInitializer ?? (() => initializeFirebaseAuth()),
        });

        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.log('[createFirebaseInitModule] Firebase initialized');
        }

        return true;
      } catch (error) {
        if (typeof __DEV__ !== 'undefined' && __DEV__) {
          console.error('[createFirebaseInitModule] Error:', error);
        }
        // Return false to indicate failure, let the app initializer handle it
        return false;
      }
    },
  };
}
