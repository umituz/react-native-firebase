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
      if (__DEV__) {
        console.log('[Firebase] Already initialized, returning existing instance');
      }
      return state.getApp();
    }

    if (state.getInitializationError()) {
      if (__DEV__) {
        console.log('[Firebase] Previous initialization failed, skipping retry');
      }
      return null;
    }

    try {
      if (__DEV__) {
        console.log('[Firebase] Initializing with projectId:', config.projectId);
      }

      FirebaseConfigValidator.validate(config);
      const app = FirebaseAppInitializer.initialize(config);
      state.setApp(app);

      if (__DEV__) {
        console.log('[Firebase] Successfully initialized');
      }

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
      if (__DEV__) {
        console.log('[Firebase] Auto-initializing with environment config');
      }
      return this.initialize(autoConfig, state);
    }

    if (__DEV__) {
      console.log('[Firebase] No configuration found for auto-initialization');
    }

    return null;
  }
}
