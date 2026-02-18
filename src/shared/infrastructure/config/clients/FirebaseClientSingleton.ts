/**
 * Firebase Client Singleton
 * Core singleton implementation for Firebase client
 */

import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import type { IFirebaseClient } from '../../../../application/ports/IFirebaseClient';
import type { FirebaseApp } from '../initializers/FirebaseAppInitializer';
import { FirebaseClientState } from '../state/FirebaseClientState';
import { FirebaseInitializationOrchestrator } from '../orchestrators/FirebaseInitializationOrchestrator';

/**
 * Firebase Client Singleton
 * Orchestrates Firebase initialization using specialized initializers
 */
export class FirebaseClientSingleton implements IFirebaseClient {
  private static instance: FirebaseClientSingleton | null = null;
  private state: FirebaseClientState;

  private constructor() {
    this.state = new FirebaseClientState();
  }

  static getInstance(): FirebaseClientSingleton {
    if (!FirebaseClientSingleton.instance) {
      FirebaseClientSingleton.instance = new FirebaseClientSingleton();
    }
    return FirebaseClientSingleton.instance;
  }

  initialize(config: FirebaseConfig): FirebaseApp | null {
    try {
      const result = FirebaseInitializationOrchestrator.initialize(config);
      // Sync state with orchestrator result
      this.state.setInstance(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.state.setInitializationError(errorMessage);
      return null;
    }
  }

  getApp(): FirebaseApp | null {
    // Check local state first
    const localApp = this.state.getApp();
    if (localApp) return localApp;

    // Try to get from orchestrator
    const result = FirebaseInitializationOrchestrator.autoInitialize();
    if (result) {
      this.state.setInstance(result);
    }
    return result;
  }

  isInitialized(): boolean {
    try {
      if (this.state && this.state.isInitialized()) return true;

      const app = FirebaseInitializationOrchestrator.autoInitialize();
      return app !== null;
    } catch {
      return false;
    }
  }

  getInitializationError(): string | null {
    return this.state.getInitializationError();
  }

  reset(): void {
    // Reset local state
    this.state.reset();
    // Note: We don't reset Firebase apps as they might be in use
  }
}
