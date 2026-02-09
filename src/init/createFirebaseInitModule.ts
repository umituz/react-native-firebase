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
        await initializeAllFirebaseServices(undefined, {
          authInitializer: authInitializer ?? (() => Promise.resolve()),
        });
        return true;
      } catch {
        // Return false to indicate failure, let the app initializer handle it
        return false;
      }
    },
  };
}
