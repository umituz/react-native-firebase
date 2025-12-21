/**
 * Firebase Auth Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firebase Auth client
 * Singleton pattern for managing Firebase Auth instance
 *
 * IMPORTANT: This package requires Firebase App to be initialized first.
 * Use @umituz/react-native-firebase to initialize Firebase App.
 *
 * SOLID Principles:
 * - Single Responsibility: Only manages Auth initialization
 * - Open/Closed: Extensible through configuration, closed for modification
 * - Dependency Inversion: Depends on Firebase App from @umituz/react-native-firebase
 */

import type { Auth } from 'firebase/auth';
import { getFirebaseApp } from '../../../infrastructure/config/FirebaseClient';
import { FirebaseAuthInitializationError } from '../../domain/errors/FirebaseAuthError';
import { FirebaseAuthInitializer } from './initializers/FirebaseAuthInitializer';
import type { FirebaseAuthConfig } from '../../domain/value-objects/FirebaseAuthConfig';

declare const __DEV__: boolean;

/**
 * Firebase Auth Client Singleton
 * Manages Firebase Auth initialization
 */
class FirebaseAuthClientSingleton {
  private static instance: FirebaseAuthClientSingleton | null = null;
  private auth: Auth | null = null;
  private initializationError: string | null = null;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get singleton instance
   */
  static getInstance(): FirebaseAuthClientSingleton {
    if (!FirebaseAuthClientSingleton.instance) {
      FirebaseAuthClientSingleton.instance = new FirebaseAuthClientSingleton();
    }
    return FirebaseAuthClientSingleton.instance;
  }

  /**
   * Initialize Firebase Auth
   * Requires Firebase App to be initialized first via @umituz/react-native-firebase
   *
   * @param config - Optional Firebase Auth configuration
   * @returns Firebase Auth instance or null if initialization fails
   */
  initialize(config?: FirebaseAuthConfig): Auth | null {
    // Return existing instance if already initialized
    if (this.auth) {
      if (__DEV__) {
        console.log('[FirebaseAuth] Already initialized, returning existing instance');
      }
      return this.auth;
    }

    // Don't retry if initialization already failed
    if (this.initializationError) {
      if (__DEV__) {
        console.warn('[FirebaseAuth] Previous initialization failed:', this.initializationError);
      }
      return null;
    }

    try {
      // Get Firebase App instance (must be initialized first)
      const app = getFirebaseApp();

      // Return null if Firebase App is not available (offline mode)
      if (!app) {
        if (__DEV__) {
          console.log('[FirebaseAuth] Firebase App not available - skipping Auth initialization');
        }
        // Don't set initializationError - this is normal offline mode
        return null;
      }

      if (__DEV__) {
        console.log('[FirebaseAuth] Initializing Firebase Auth...');
      }

      // Initialize Auth
      this.auth = FirebaseAuthInitializer.initialize(app, config);

      if (this.auth) {
        if (__DEV__) {
          console.log('[FirebaseAuth] ✅ Successfully initialized');
        }
      } else {
        if (__DEV__) {
          console.warn('[FirebaseAuth] ⚠️ Initialization returned null');
        }
      }

      return this.auth;
    } catch (error) {
      // Only set error if it's a real initialization failure, not just missing config
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (__DEV__) {
        console.error('[FirebaseAuth] ❌ Initialization error:', errorMessage);
      }
      if (!errorMessage.includes('not initialized') && !errorMessage.includes('not available')) {
        this.initializationError = errorMessage;
      }
      return null;
    }
  }

  /**
   * Get the Firebase Auth instance
   * Auto-initializes if Firebase App is available
   * Returns null if config is not available (offline mode - no error)
   * @returns Firebase Auth instance or null if not initialized
   */
  getAuth(): Auth | null {
    // Auto-initialize if not already initialized
    if (!this.auth && !this.initializationError) {
      try {
        // Try to get Firebase App (will auto-initialize if config is available)
        const app = getFirebaseApp();
        if (app) {
          this.initialize();
        }
      } catch {
        // Firebase App not available, return null (offline mode)
        return null;
      }
    }

    // Return null if not initialized (offline mode - no error)
    return this.auth || null;
  }

  /**
   * Check if Auth is initialized
   */
  isInitialized(): boolean {
    return this.auth !== null;
  }

  /**
   * Get initialization error if any
   */
  getInitializationError(): string | null {
    return this.initializationError;
  }

  /**
   * Reset the Auth client instance
   * Useful for testing
   */
  reset(): void {
    this.auth = null;
    this.initializationError = null;
  }
}

/**
 * Singleton instance
 */
export const firebaseAuthClient = FirebaseAuthClientSingleton.getInstance();

export function initializeFirebaseAuth(
  config?: FirebaseAuthConfig
): Auth | null {
  return firebaseAuthClient.initialize(config);
}

/**
 * Get Firebase Auth instance
 * Auto-initializes if Firebase App is available
 * Returns null if config is not available (offline mode - no error)
 * @returns Firebase Auth instance or null if not initialized
 */
export function getFirebaseAuth(): Auth | null {
  return firebaseAuthClient.getAuth();
}

/**
 * Check if Firebase Auth is initialized
 */
export function isFirebaseAuthInitialized(): boolean {
  return firebaseAuthClient.isInitialized();
}

/**
 * Get initialization error if any
 */
export function getFirebaseAuthInitializationError(): string | null {
  return firebaseAuthClient.getInitializationError();
}

/**
 * Reset Firebase Auth client instance
 * Useful for testing
 */
export function resetFirebaseAuthClient(): void {
  firebaseAuthClient.reset();
}

// Export types
export type { Auth } from 'firebase/auth';
export type { FirebaseAuthConfig } from '../../domain/value-objects/FirebaseAuthConfig';

