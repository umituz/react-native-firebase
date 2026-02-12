/**
 * Firebase Initialization Service
 * Service layer for Firebase initialization with auth support
 */

import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';
import type { FirebaseApp } from '../initializers/FirebaseAppInitializer';
import { FirebaseClientSingleton } from '../clients/FirebaseClientSingleton';
import { loadFirebaseConfig } from '../FirebaseConfigLoader';

/**
 * Auth initializer callback type
 * Returns a Promise that resolves when auth initialization is complete
 */
export type AuthInitializer = () => Promise<void>;

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
 * Initialize Firebase client with configuration
 */
export function initializeFirebase(config: FirebaseConfig): FirebaseApp | null {
  return FirebaseClientSingleton.getInstance().initialize(config);
}

/**
 * Get Firebase app instance
 * Auto-initializes from Constants/environment if not already initialized
 */
export function getFirebaseApp(): FirebaseApp | null {
  return FirebaseClientSingleton.getInstance().getApp();
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
  return FirebaseClientSingleton.getInstance().isInitialized();
}

/**
 * Get initialization error if any
 */
export function getFirebaseInitializationError(): string | null {
  return FirebaseClientSingleton.getInstance().getInitializationError();
}

/**
 * Reset Firebase client instance
 */
export function resetFirebaseClient(): void {
  FirebaseClientSingleton.getInstance().reset();
}
