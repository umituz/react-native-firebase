/**
 * Firebase Auth Client - Infrastructure Layer
 *
 * Manages Firebase Authentication instance initialization
 */

import type { Auth } from 'firebase/auth';
import { getFirebaseApp } from '../../../../shared/infrastructure/config/FirebaseClient';
import { FirebaseAuthInitializer } from './initializers/FirebaseAuthInitializer';
import type { FirebaseAuthConfig } from '../../domain/value-objects/FirebaseAuthConfig';
import { ServiceClientSingleton } from '../../../../shared/infrastructure/config/base/ServiceClientSingleton';

/**
 * Firebase Auth Client Singleton
 */
class FirebaseAuthClientSingleton extends ServiceClientSingleton<Auth, FirebaseAuthConfig> {
  private constructor() {
    super({
      serviceName: 'FirebaseAuth',
      initializer: (config?: FirebaseAuthConfig) => {
        const app = getFirebaseApp();
        if (!app) {
          this.setError('Firebase App is not initialized');
          return null;
        }
        const auth = FirebaseAuthInitializer.initialize(app, config);
        if (!auth) {
          this.setError('Auth initialization returned null');
        }
        return auth;
      },
    });
  }

  private static instance: FirebaseAuthClientSingleton | null = null;

  static getInstance(): FirebaseAuthClientSingleton {
    if (!this.instance) this.instance = new FirebaseAuthClientSingleton();
    return this.instance;
  }

  /**
   * Initialize Auth with optional configuration
   */
  override initialize(config?: FirebaseAuthConfig): Auth | null {
    return super.initialize(config);
  }

  /**
   * Get Auth instance
   */
  getAuth(): Auth | null {
    // Attempt initialization if not already initialized
    if (!this.isInitialized() && !this.getInitializationError()) {
      try {
        const app = getFirebaseApp();
        if (app) {
          this.initialize();
        }
      } catch (error) {
        // Silently handle auto-initialization errors
        // The error will be stored in state for later retrieval
        const errorMessage = error instanceof Error ? error.message : 'Auto-initialization failed';
        this.setError(errorMessage);
      }
    }
    // Enable auto-initialization flag when getting instance
    return this.getInstance(true);
  }
}

export const firebaseAuthClient = FirebaseAuthClientSingleton.getInstance();
export const initializeFirebaseAuth = (c?: FirebaseAuthConfig) => firebaseAuthClient.initialize(c);
export const getFirebaseAuth = () => firebaseAuthClient.getAuth();
export const isFirebaseAuthInitialized = () => firebaseAuthClient.isInitialized();
export const getFirebaseAuthInitializationError = () => firebaseAuthClient.getInitializationError();
export const resetFirebaseAuthClient = () => firebaseAuthClient.reset();

export type { Auth } from 'firebase/auth';
export type { FirebaseAuthConfig } from '../../domain/value-objects/FirebaseAuthConfig';
