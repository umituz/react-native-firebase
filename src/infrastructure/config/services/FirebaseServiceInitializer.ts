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

export interface ServiceInitializationResult {
  auth: unknown;
  authError?: string;
}

export class FirebaseServiceInitializer {
  static async initializeServices(
    options?: ServiceInitializationOptions
  ): Promise<ServiceInitializationResult> {
    let auth: unknown = null;
    let authError: string | undefined;

    if (options?.authInitializer) {
      try {
        auth = await options.authInitializer();
      } catch (error) {
        // Auth initialization is optional but we should log the error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        authError = errorMessage;

        if (__DEV__) {
          console.error('[FirebaseServiceInitializer] Auth initialization failed:', errorMessage);
        }
      }
    }

    return { auth, authError };
  }
}
