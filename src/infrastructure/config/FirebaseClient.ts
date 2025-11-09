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
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
import { FirebaseInitializationError } from '../../domain/errors/FirebaseError';
import type { IFirebaseClient } from '../../application/ports/IFirebaseClient';
import { FirebaseConfigValidator } from './validators/FirebaseConfigValidator';
import { FirebaseAppInitializer } from './initializers/FirebaseAppInitializer';
import { FirebaseAuthInitializer } from './initializers/FirebaseAuthInitializer';
import { FirebaseFirestoreInitializer } from './initializers/FirebaseFirestoreInitializer';

/**
 * Firebase Client Singleton
 * Orchestrates Firebase initialization using specialized initializers
 */
class FirebaseClientSingleton implements IFirebaseClient {
  private static instance: FirebaseClientSingleton | null = null;
  private app: FirebaseApp | null = null;
  private auth: Auth | null = null;
  private db: Firestore | null = null;
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

      // Initialize Auth
      this.auth = FirebaseAuthInitializer.initialize(this.app, config);

      // Initialize Firestore
      this.db = FirebaseFirestoreInitializer.initialize(this.app);

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
   * @throws {FirebaseInitializationError} If client is not initialized
   */
  getApp(): FirebaseApp {
    if (!this.app) {
      const errorMsg =
        this.initializationError ||
        'Firebase client not initialized. Call initialize() first with configuration.';
      throw new FirebaseInitializationError(errorMsg);
    }
    return this.app;
  }

  /**
   * Get the Firebase Auth instance
   * @throws {FirebaseInitializationError} If client is not initialized
   */
  getAuth(): Auth {
    if (!this.auth) {
      const errorMsg =
        this.initializationError ||
        'Firebase client not initialized. Call initialize() first with configuration.';
      throw new FirebaseInitializationError(errorMsg);
    }
    return this.auth;
  }

  /**
   * Get the Firestore instance
   * @throws {FirebaseInitializationError} If client is not initialized
   */
  getFirestore(): Firestore {
    if (!this.db) {
      const errorMsg =
        this.initializationError ||
        'Firebase client not initialized. Call initialize() first with configuration.';
      throw new FirebaseInitializationError(errorMsg);
    }
    return this.db;
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
    this.auth = null;
    this.db = null;
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
 * @throws {FirebaseInitializationError} If client is not initialized
 */
export function getFirebaseApp(): FirebaseApp {
  return firebaseClient.getApp();
}

/**
 * Get Firebase Auth instance
 * @throws {FirebaseInitializationError} If client is not initialized
 */
export function getFirebaseAuth(): Auth {
  return firebaseClient.getAuth();
}

/**
 * Get Firestore instance
 * @throws {FirebaseInitializationError} If client is not initialized
 */
export function getFirestore(): Firestore {
  return firebaseClient.getFirestore();
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
export type { Auth } from 'firebase/auth';
export type { Firestore } from 'firebase/firestore';
export type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
