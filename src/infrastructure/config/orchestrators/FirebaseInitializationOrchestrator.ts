/**
 * Firebase Initialization Orchestrator
 * Handles the initialization logic for Firebase App
 *
 * Single Responsibility: Only orchestrates Firebase App initialization
 */

import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import type { FirebaseApp } from '../initializers/FirebaseAppInitializer';
import { FirebaseConfigValidator } from '../validators/FirebaseConfigValidator';
import { FirebaseAppInitializer } from '../initializers/FirebaseAppInitializer';
import { loadFirebaseConfig } from '../FirebaseConfigLoader';
import type { FirebaseClientState } from '../state/FirebaseClientState';

export class FirebaseInitializationOrchestrator {
  static initialize(
    config: FirebaseConfig,
    state: FirebaseClientState
  ): FirebaseApp | null {
    if (state.isInitialized()) {
      return state.getApp();
    }

    if (state.getInitializationError()) {
      return null;
    }

    try {
      FirebaseConfigValidator.validate(config);
      const app = FirebaseAppInitializer.initialize(config);
      state.setApp(app);

      return app;
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to initialize Firebase client';
      state.setInitializationError(errorMessage);

      if (__DEV__) {
        console.error('[Firebase] Initialization failed:', errorMessage);
      }

      return null;
    }
  }

  static autoInitialize(state: FirebaseClientState): FirebaseApp | null {
    if (state.isInitialized() || state.getInitializationError()) {
      return state.getApp();
    }

    const autoConfig = loadFirebaseConfig();
    if (autoConfig) {
      return this.initialize(autoConfig, state);
    }

    return null;
  }
}
