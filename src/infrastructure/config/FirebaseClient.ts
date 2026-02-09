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
    return FirebaseInitializationOrchestrator.initialize(config);
  }

  getApp(): FirebaseApp | null {
    return FirebaseInitializationOrchestrator.autoInitialize();
  }

  isInitialized(): boolean {
    return this.state.isInitialized();
  }

  getInitializationError(): string | null {
    return this.state.getInitializationError();
  }

  reset(): void {
    this.state.reset();
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
