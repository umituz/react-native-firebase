/**
 * Firebase App Initializer
 *
 * Single Responsibility: Initialize Firebase App instance
 */

import {
  initializeApp,
  getApps,
  type FirebaseApp as FirebaseAppType,
} from 'firebase/app';
import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import { FirebaseInitializationError } from '../../../domain/errors/FirebaseError';

export type FirebaseApp = FirebaseAppType;

/**
 * Firebase configuration mapper
 */
class FirebaseConfigMapper {
  /**
   * Map domain config to Firebase SDK config
   */
  static toFirebaseConfig(config: FirebaseConfig): Record<string, string | undefined> {
    return {
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId,
    };
  }
}

/**
 * Firebase App manager
 */
class FirebaseAppManager {
  /**
   * Check if Firebase App is already initialized
   */
  static isInitialized(): boolean {
    try {
      const existingApps = getApps();
      return existingApps.length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Get existing Firebase App instance
   */
  static getExistingApp(): FirebaseApp | null {
    try {
      const existingApps = getApps();
      return existingApps.length > 0 ? existingApps[0] ?? null : null;
    } catch {
      return null;
    }
  }

  /**
   * Create new Firebase App instance
   */
  static createApp(config: FirebaseConfig): FirebaseApp {
    try {
      const firebaseConfig = FirebaseConfigMapper.toFirebaseConfig(config);
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

/**
 * Initializes Firebase App
 */
export class FirebaseAppInitializer {
  /**
   * Initialize or get existing Firebase App
   */
  static initialize(config: FirebaseConfig): FirebaseApp {
    // Return existing app if already initialized
    const existingApp = FirebaseAppManager.getExistingApp();
    if (existingApp) {
      return existingApp;
    }

    // Create new app
    return FirebaseAppManager.createApp(config);
  }
}
