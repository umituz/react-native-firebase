/**
 * Firebase Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firebase client
 * Singleton pattern for managing Firebase client instance
 *
 * IMPORTANT: This package does NOT read from .env files.
 * Configuration must be provided by the application.
 *
 * NOTE: Auth initialization is handled by the main app via callback.
 * This removes the need for dynamic require() which causes issues in production.
 *
 * SOLID Principles:
 * - Single Responsibility: Only orchestrates initialization, delegates to specialized classes
 * - Open/Closed: Extensible through configuration, closed for modification
 * - Dependency Inversion: Depends on abstractions (interfaces), not concrete implementations
 */

 
if (typeof __DEV__ !== "undefined" && __DEV__) console.log("📍 [LIFECYCLE] FirebaseClient.ts - Module loading");

import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
import type { IFirebaseClient } from '../../application/ports/IFirebaseClient';
import type { FirebaseApp } from './initializers/FirebaseAppInitializer';
import { FirebaseClientState } from './state/FirebaseClientState';
import { FirebaseInitializationOrchestrator } from './orchestrators/FirebaseInitializationOrchestrator';
import {
  FirebaseServiceInitializer,
  type AuthInitializer,
  type ServiceInitializationOptions,
} from './services/FirebaseServiceInitializer';
import { loadFirebaseConfig } from './FirebaseConfigLoader';

export type { FirebaseApp, AuthInitializer, ServiceInitializationOptions };

declare const __DEV__: boolean;

/**
 * Service initialization result interface
 */
export interface ServiceInitializationResult {
  app: FirebaseApp | null;
  auth: unknown;
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
    return FirebaseInitializationOrchestrator.initialize(config, this.state);
  }

  getApp(): FirebaseApp | null {
    return FirebaseInitializationOrchestrator.autoInitialize(this.state);
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
 * This is the main entry point for applications - call this once at app startup
 *
 * IMPORTANT: Auth initialization is handled via callback to avoid require() issues.
 * The main app should pass the authInitializer callback from react-native-firebase-auth.
 *
 * @param config - Optional Firebase configuration
 * @param options - Optional service initialization options including authInitializer
 * @returns Object with initialization results for each service
 *
 * @example
 * ```typescript
 * import { initializeAllFirebaseServices } from '@umituz/react-native-firebase';
 * import { initializeFirebaseAuth } from '@umituz/react-native-firebase-auth';
 *
 * const result = await initializeAllFirebaseServices(undefined, {
 *   authInitializer: () => initializeFirebaseAuth(),
 * });
 * ```
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

  const { auth } = await FirebaseServiceInitializer.initializeServices(options);

  if (__DEV__) {
    console.log('[Firebase] All services initialized:', {
      app: !!app,
      auth: !!auth,
    });
  }

  return {
    app,
    auth,
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
