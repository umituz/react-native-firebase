/**
 * Firebase Initialization Orchestrator
 *
 * Orchestrates the initialization of Firebase services
 */

import type { FirebaseApp } from 'firebase/app';
import { getApps } from 'firebase/app';
import { initializeApp } from 'firebase/app';
import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import { FirebaseInitializationError } from '../../../domain/errors/FirebaseError';

/**
 * Orchestrates Firebase initialization
 */
export class FirebaseInitializationOrchestrator {
  /**
   * Initialize Firebase app
   */
  static initialize(config: FirebaseConfig): FirebaseApp {
    // Check for existing app
    const existingApps = getApps();
    const existingApp = existingApps.length > 0 ? existingApps[0] : undefined;
    if (existingApp) {
      return existingApp;
    }

    // Initialize new app
    try {
      return initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId,
      });
    } catch (error) {
      throw new FirebaseInitializationError(
        `Failed to initialize Firebase: ${error instanceof Error ? error.message : 'Unknown error'}`,
        error
      );
    }
  }

  /**
   * Get existing app instance
   */
  static autoInitialize(): FirebaseApp | null {
    const existingApps = getApps();
    return existingApps.length > 0 ? (existingApps[0] ?? null) : null;
  }
}
