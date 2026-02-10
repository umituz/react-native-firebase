/**
 * Firebase Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firebase client
 * Singleton pattern for managing Firebase client instance
 *
 * IMPORTANT: This package does NOT read from .env files.
 * Configuration must be provided by the application.
 */

import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
import type { IFirebaseClient } from '../../application/ports/IFirebaseClient';
import type { FirebaseApp } from './initializers/FirebaseAppInitializer';
import { FirebaseClientState } from './state/FirebaseClientState';
import { FirebaseInitializationOrchestrator } from './orchestrators/FirebaseInitializationOrchestrator';
import { loadFirebaseConfig } from './FirebaseConfigLoader';

export type { FirebaseApp };

/**
 * Auth initializer callback type
 */
export type AuthInitializer = () => Promise<void> | ((() => (any | null) | null));

/**
 * Service initialization options
 */
export interface ServiceInitializationOptions {
  authInitializer?: AuthInitializer;
}

/**
 * Service initialization result interface
 */
export interface ServiceInitializationResult {
  app: FirebaseApp | null;
  auth: boolean | null;
  authError?: string;
}

/**
 * Firebase Client Singleton
 * Orchestrates Firebase initialization using specialized initializers
 */
class FirebaseClientSingleton implements IFirebaseClient {
  private static instance: FirebaseClientSingleton | null = null;
  private state: FirebaseClientState;
  private lastError: string | null = null;

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
      this.lastError = null;
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.lastError = errorMessage;
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
    // Check both local state and orchestrator for consistency
    if (this.state.isInitialized()) return true;

    // Check if Firebase has any apps initialized
    return FirebaseInitializationOrchestrator.autoInitialize() !== null;
  }

  getInitializationError(): string | null {
    // Check local state first
    const localError = this.state.getInitializationError();
    if (localError) return localError;
    // Return last error
    return this.lastError;
  }

  reset(): void {
    // Reset local state
    this.state.reset();
    this.lastError = null;
    // Note: We don't reset Firebase apps as they might be in use
  }
}

export const firebaseClient = FirebaseClientSingleton.getInstance();

/**
 * Initialize Firebase client with configuration
 */
export function initializeFirebase(config: FirebaseConfig): FirebaseApp | null {
  return firebaseClient.initialize(config);
}

/**
 * Get Firebase app instance
 * Auto-initializes from Constants/environment if not already initialized
 */
export function getFirebaseApp(): FirebaseApp | null {
  return firebaseClient.getApp();
}

/**
 * Auto-initialize Firebase from Constants/environment
 */
export function autoInitializeFirebase(): FirebaseApp | null {
  const config = loadFirebaseConfig();
  if (config) {
    return initializeFirebase(config);
  }
  return null;
}

/**
 * Initialize all Firebase services (App and Auth)
 * This is the main entry point for applications
 */
export async function initializeAllFirebaseServices(
  config?: FirebaseConfig,
  options?: ServiceInitializationOptions
): Promise<ServiceInitializationResult> {
  const app = config ? initializeFirebase(config) : autoInitializeFirebase();

  if (!app) {
    return {
      app: null,
      auth: null,
    };
  }

  // Initialize Auth if provided
  let authSuccess = null;
  let authError: string | undefined;

  if (options?.authInitializer) {
    try {
      await options.authInitializer();
      authSuccess = true;
    } catch (error) {
      authError = error instanceof Error ? error.message : 'Auth initialization failed';
    }
  }

  return {
    app,
    auth: authSuccess,
    authError,
  };
}

/**
 * Check if Firebase client is initialized
 */
export function isFirebaseInitialized(): boolean {
  return firebaseClient.isInitialized();
}

/**
 * Get initialization error if any
 */
export function getFirebaseInitializationError(): string | null {
  return firebaseClient.getInitializationError();
}

/**
 * Reset Firebase client instance
 */
export function resetFirebaseClient(): void {
  firebaseClient.reset();
}
