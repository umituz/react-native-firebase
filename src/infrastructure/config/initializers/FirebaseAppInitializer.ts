/**
 * Firebase App Initializer
 *
 * Single Responsibility: Initialize Firebase App instance
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import { FirebaseInitializationError } from '../../../domain/errors/FirebaseError';

/**
 * Initializes Firebase App
 */
export class FirebaseAppInitializer {
  /**
   * Initialize or get existing Firebase App
   */
  static initialize(config: FirebaseConfig): FirebaseApp {
    // Return existing app if already initialized
    const existingApps = getApps();
    if (existingApps.length > 0) {
      return existingApps[0];
    }

    try {
      const firebaseConfig = {
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      };

      return initializeApp(firebaseConfig);
    } catch (error) {
      throw new FirebaseInitializationError(
        `Failed to initialize Firebase App: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error
      );
    }
  }
}

