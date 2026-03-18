/**
 * Firebase Auth Client - Infrastructure Layer
 *
 * Manages Firebase Authentication instance initialization
 */

import type { Auth } from 'firebase/auth';
import { getAuth as getFirebaseAuthFromFirebase } from 'firebase/auth';
import { getFirebaseApp } from '../../../../shared/infrastructure/config/services/FirebaseInitializationService';
import type { FirebaseAuthConfig } from '../../domain/value-objects/FirebaseAuthConfig';
import { ServiceClientSingleton } from '../../../../shared/infrastructure/config/base/ServiceClientSingleton';

/**
 * Firebase Auth Client Singleton
 */
class FirebaseAuthClientSingleton extends ServiceClientSingleton<Auth, FirebaseAuthConfig> {
  private constructor() {
    super();
  }

  initialize(): Auth {
    try {
      const app = getFirebaseApp();
      if (!app) {
        this.setError('Firebase App is not initialized');
        throw new Error('Firebase App is not initialized');
      }

      const auth = getFirebaseAuthFromFirebase(app);
      this.instance = auth;
      return auth;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Auth initialization failed';
      this.setError(errorMessage);
      throw error;
    }
  }

  getAuth(): Auth {
    if (!this.isInitialized()) {
      return this.initialize();
    }
    return this.getInstance();
  }

  private static instance: FirebaseAuthClientSingleton | null = null;

  static getInstance(): FirebaseAuthClientSingleton {
    if (!this.instance) {
      this.instance = new FirebaseAuthClientSingleton();
    }
    return this.instance;
  }
}

const firebaseAuthClientSingleton = FirebaseAuthClientSingleton.getInstance();

export const initializeFirebaseAuth = (): Auth => {
  return firebaseAuthClientSingleton.initialize();
};

export const getFirebaseAuth = (): Auth => {
  return firebaseAuthClientSingleton.getAuth();
};

export const isFirebaseAuthInitialized = (): boolean => {
  return firebaseAuthClientSingleton.isInitialized();
};

export const getFirebaseAuthInitializationError = (): Error | null => {
  return firebaseAuthClientSingleton.getInitializationError();
};

export const resetFirebaseAuthClient = (): void => {
  firebaseAuthClientSingleton.reset();
};

export type { Auth } from 'firebase/auth';
