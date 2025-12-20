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

import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
import type { IFirebaseClient } from '../../application/ports/IFirebaseClient';
import { FirebaseConfigValidator } from './validators/FirebaseConfigValidator';
import {
  FirebaseAppInitializer,
  type FirebaseApp,
} from './initializers/FirebaseAppInitializer';
import { loadFirebaseConfig } from './FirebaseConfigLoader';

export type { FirebaseApp };

// Development environment check
declare const __DEV__: boolean;

/**
 * Firebase Client State Manager
 * Manages the state of Firebase initialization
 */
class FirebaseClientState {
  private app: FirebaseApp | null = null;
  private initializationError: string | null = null;

  /**
   * Get the current Firebase app instance
   */
  getApp(): FirebaseApp | null {
    return this.app;
  }

  /**
   * Set the Firebase app instance
   */
  setApp(app: FirebaseApp | null): void {
    this.app = app;
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
   * Set initialization error
   */
  setInitializationError(error: string | null): void {
    this.initializationError = error;
  }

  /**
   * Reset the client state
   */
  reset(): void {
    this.app = null;
    this.initializationError = null;
  }
}

/**
 * Firebase Initialization Orchestrator
 * Handles the initialization logic
 */
class FirebaseInitializationOrchestrator {
  /**
   * Initialize Firebase with configuration
   */
  static initialize(
    config: FirebaseConfig,
    state: FirebaseClientState
  ): FirebaseApp | null {
    // Return existing instance if already initialized
    if (state.isInitialized()) {
      if (__DEV__) {
        console.log('[Firebase] Already initialized, returning existing instance');
      }
      return state.getApp();
    }

    // Don't retry if initialization already failed
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

      // Validate configuration
      FirebaseConfigValidator.validate(config);

      // Initialize Firebase App
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

  /**
   * Auto-initialize Firebase from environment
   */
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
    return FirebaseInitializationOrchestrator.initialize(config, this.state);
  }

  /**
   * Get the Firebase app instance
   * Auto-initializes from Constants/environment if not already initialized
   * Returns null if config is not available (offline mode - no error)
   * @returns Firebase app instance or null if not initialized
   */
  getApp(): FirebaseApp | null {
    return FirebaseInitializationOrchestrator.autoInitialize(this.state);
  }

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean {
    return this.state.isInitialized();
  }

  /**
   * Get initialization error if any
   */
  getInitializationError(): string | null {
    return this.state.getInitializationError();
  }

  /**
   * Reset the client instance
   * Useful for testing
   */
  reset(): void {
    this.state.reset();
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
 * Service initialization result interface
 */
interface ServiceInitializationResult {
  app: FirebaseApp | null;
  auth: any | null;
  analytics: any | null;
  crashlytics: any | null;
}

/**
 * Service initializer class for better separation of concerns
 */
class ServiceInitializer {
  /**
   * Initialize optional Firebase service with error handling
   */
  private static initializeService(
    packageName: string,
    initializerName: string,
    isAsync = false
  ): any | null {
    try {
      const serviceModule = require(packageName);
      const service = serviceModule[initializerName];

      if (isAsync && typeof service.init === 'function') {
        return service;
      }

      return typeof service === 'function' ? service() : service;
    } catch {
      return null;
    }
  }

  /**
   * Initialize all optional Firebase services
   */
  static async initializeServices(): Promise<{
    auth: any | null;
    analytics: any | null;
    crashlytics: any | null;
  }> {
    if (__DEV__) {
      console.log('[Firebase] Initializing optional services...');
    }

    const auth = this.initializeService(
      '@umituz/react-native-firebase-auth',
      'initializeFirebaseAuth'
    );

    const analytics = this.initializeService(
      '@umituz/react-native-firebase-analytics',
      'firebaseAnalyticsService',
      true
    );

    const crashlytics = this.initializeService(
      '@umituz/react-native-firebase-crashlytics',
      'firebaseCrashlyticsService',
      true
    );

    if (__DEV__) {
      console.log('[Firebase] Services initialized - Auth:', !!auth, 'Analytics:', !!analytics, 'Crashlytics:', !!crashlytics);
    }

    return { auth, analytics, crashlytics };
  }
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
): Promise<ServiceInitializationResult> {
  const app = config ? initializeFirebase(config) : autoInitializeFirebase();

  if (!app) {
    return {
      app: null,
      auth: null,
      analytics: null,
      crashlytics: null,
    };
  }

  const { auth, analytics, crashlytics } = await ServiceInitializer.initializeServices();

  // Initialize services if they have an init method
  if (analytics && typeof analytics.init === 'function') {
    await analytics.init();
  }

  if (crashlytics && typeof crashlytics.init === 'function') {
    await crashlytics.init();
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