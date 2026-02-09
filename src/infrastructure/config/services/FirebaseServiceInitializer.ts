/**
 * Firebase Service Initializer
 *
 * Orchestrates initialization of all Firebase services
 * NOTE: This file is deprecated - use FirebaseClient.ts instead
 * Kept for backwards compatibility
 */

import type { FirebaseApp } from 'firebase/app';

/**
 * Initialize Firebase services
 * @deprecated Use initializeAllFirebaseServices from FirebaseClient instead
 */
export class FirebaseServiceInitializer {
  /**
   * Initialize all Firebase services
   * @deprecated
   */
  static async initializeAll(
    _app: FirebaseApp,
    _options?: unknown
  ): Promise<{ app: FirebaseApp | null; auth: boolean | null }> {
    // This is now handled by FirebaseClient
    return {
      app: null,
      auth: null,
    };
  }

  /**
   * Initialize services (legacy compatibility)
   * @deprecated
   */
  static async initializeServices(
    _options?: unknown
  ): Promise<{ app: FirebaseApp | null; auth: boolean | null }> {
    return {
      app: null,
      auth: null,
    };
  }
}
