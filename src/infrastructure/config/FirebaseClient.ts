/**
 * Firebase Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firebase client
 * Singleton pattern for managing Firebase client instance
 *
 * IMPORTANT: This package does NOT read from .env files.
 * Configuration must be provided by the application.
 *
 * SOLID Principles:
 * - Single Responsibility: Only orchestrates initialization, delegates to specialized classes
 * - Open/Closed: Extensible through configuration, closed for modification
 * - Dependency Inversion: Depends on abstractions (interfaces), not concrete implementations
 */

import type { FirebaseApp } from 'firebase/app';
import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
import { FirebaseInitializationError } from '../../domain/errors/FirebaseError';
import type { IFirebaseClient } from '../../application/ports/IFirebaseClient';
import { FirebaseConfigValidator } from './validators/FirebaseConfigValidator';
import { FirebaseAppInitializer } from './initializers/FirebaseAppInitializer';
import { loadFirebaseConfig } from './FirebaseConfigLoader';

/**
 * Firebase Client Singleton
 * Orchestrates Firebase initialization using specialized initializers
 */
class FirebaseClientSingleton implements IFirebaseClient {
  private static instance: FirebaseClientSingleton | null = null;
  private app: FirebaseApp | null = null;
  private initializationError: string | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get singleton instance
   */
  static getInstance(): FirebaseClientSingleton {
    if (!FirebaseClientSingleton.instance) {
      FirebaseClientSingleton.instance = new FirebaseClientSingleton();
    }
    return FirebaseClientSingleton.instance;
  }

  /**
   * Initialize Firebase client with configuration
   * Configuration must be provided by the application (not from .env)
   *
   * @param config - Firebase configuration
   * @returns Firebase app instance or null if initialization fails
   */
  initialize(config: FirebaseConfig): FirebaseApp | null {
    // Return existing instance if already initialized
    if (this.app) {
      return this.app;
    }

    // Don't retry if initialization already failed
    if (this.initializationError) {
      return null;
    }

    try {
      // Validate configuration
      FirebaseConfigValidator.validate(config);

      // Initialize Firebase App
      this.app = FirebaseAppInitializer.initialize(config);

      return this.app;
    } catch (error) {
      this.initializationError =
        error instanceof Error
          ? error.message
          : 'Failed to initialize Firebase client';
      return null;
    }
  }

  /**
   * Get the Firebase app instance
   * Auto-initializes from Constants/environment if not already initialized
   * Returns null if config is not available (offline mode)
   * @returns Firebase app instance or null if not initialized
   */
  getApp(): FirebaseApp | null {
    // Auto-initialize if not already initialized
    if (!this.app && !this.initializationError) {
      const autoConfig = loadFirebaseConfig();
      if (autoConfig) {
        this.initialize(autoConfig);
      }
    }

    // Return null if not initialized (offline mode - no error)
    return this.app || null;
  }


  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.app !== null;
  }

  /**
   * Get initialization error if any
   */
  getInitializationError(): string | null {
    return this.initializationError;
  }

  /**
   * Reset the client instance
   * Useful for testing
   */
  reset(): void {
    this.app = null;
    this.initializationError = null;
  }
}

/**
 * Singleton instance
 */
export const firebaseClient = FirebaseClientSingleton.getInstance();

/**
 * Initialize Firebase client
 * This is the main entry point for applications
 *
 * @param config - Firebase configuration (must be provided by app, not from .env)
 * @returns Firebase app instance or null if initialization fails
 *
 * @example
 * ```typescript
 * import { initializeFirebase } from '@umituz/react-native-firebase';
 *
 * const config = {
 *   apiKey: 'your-api-key',
 *   authDomain: 'your-project.firebaseapp.com',
 *   projectId: 'your-project-id',
 * };
 *
 * const app = initializeFirebase(config);
 * ```
 */
export function initializeFirebase(
  config: FirebaseConfig
): FirebaseApp | null {
  return firebaseClient.initialize(config);
}

/**
 * Get Firebase app instance
 * Auto-initializes from Constants/environment if not already initialized
 * Returns null if config is not available (offline mode - no error)
 * @returns Firebase app instance or null if not initialized
 */
export function getFirebaseApp(): FirebaseApp | null {
  return firebaseClient.getApp();
}

/**
 * Auto-initialize Firebase from Constants/environment
 * Called automatically when getFirebaseApp() is first accessed
 * Can be called manually to initialize early
 * @returns Firebase app instance or null if initialization fails
 */
export function autoInitializeFirebase(): FirebaseApp | null {
  const config = loadFirebaseConfig();
  if (config) {
    return initializeFirebase(config);
  }
  return null;
}

/**
 * Initialize all Firebase services (App, Auth, Analytics, Crashlytics)
 * This is the main entry point for applications - call this once at app startup
 * All services will be initialized automatically if Firebase App is available
 * 
 * @param config - Optional Firebase configuration (if not provided, will auto-load from Constants/env)
 * @returns Object with initialization results for each service
 * 
 * @example
 * ```typescript
 * import { initializeAllFirebaseServices } from '@umituz/react-native-firebase';
 * 
 * // Auto-initialize from Constants/env
 * const result = await initializeAllFirebaseServices();
 * 
 * // Or provide config explicitly
 * const result = await initializeAllFirebaseServices({
 *   apiKey: 'your-api-key',
 *   projectId: 'your-project-id',
 *   // ...
 * });
 * ```
 */
export async function initializeAllFirebaseServices(
  config?: FirebaseConfig
): Promise<{
  app: FirebaseApp | null;
  auth: any | null;
  analytics: any | null;
  crashlytics: any | null;
}> {
  // 1. Initialize Firebase App
  let app: FirebaseApp | null = null;
  if (config) {
    app = initializeFirebase(config);
  } else {
    app = autoInitializeFirebase();
  }

  if (!app) {
    // Firebase App not available - return null for all services
    return {
      app: null,
      auth: null,
      analytics: null,
      crashlytics: null,
    };
  }

  // 2. Initialize Firebase Auth (if package is available)
  let auth: any | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { initializeFirebaseAuth } = require('@umituz/react-native-firebase-auth');
    auth = initializeFirebaseAuth();
  } catch {
    // @umituz/react-native-firebase-auth not available
  }

  // 3. Initialize Firebase Analytics (if package is available)
  let analytics: any | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { firebaseAnalyticsService } = require('@umituz/react-native-firebase-analytics');
    await firebaseAnalyticsService.init();
    analytics = firebaseAnalyticsService;
  } catch {
    // @umituz/react-native-firebase-analytics not available
  }

  // 4. Initialize Firebase Crashlytics (if package is available)
  let crashlytics: any | null = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { firebaseCrashlyticsService } = require('@umituz/react-native-firebase-crashlytics');
    await firebaseCrashlyticsService.init();
    crashlytics = firebaseCrashlyticsService;
  } catch {
    // @umituz/react-native-firebase-crashlytics not available
  }

  return {
    app,
    auth,
    analytics,
    crashlytics,
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
 * Useful for testing
 */
export function resetFirebaseClient(): void {
  firebaseClient.reset();
}

// Export types
export type { FirebaseApp } from 'firebase/app';
export type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
