/**
 * Firebase Service Initializer
 * Handles initialization of Firebase Auth service
 *
 * NOTE: Auth initialization is handled by the main app via callback.
 * This removes the need for dynamic require() which causes issues in production.
 *
 * Single Responsibility: Only initializes Firebase Auth service
 */

export type AuthInitializer = () => unknown;

export interface ServiceInitializationOptions {
  authInitializer?: AuthInitializer;
}

export interface ServiceInitializationResult {
  auth: unknown;
}

export class FirebaseServiceInitializer {
  static async initializeServices(
    options?: ServiceInitializationOptions
  ): Promise<ServiceInitializationResult> {
    if (__DEV__) {
      console.log('[Firebase] Initializing auth service...');
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

    if (__DEV__) {
      console.log('[Firebase] Auth service initialized:', !!auth);
    }

    return { auth };
  }
}
