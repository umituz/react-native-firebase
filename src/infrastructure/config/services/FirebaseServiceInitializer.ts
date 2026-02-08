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
    let auth: unknown = null;
    if (options?.authInitializer) {
      try {
        auth = await options.authInitializer();
      } catch (error) {
        // Silently fail, auth initialization is optional
      }
    }

    return { auth };
  }
}
