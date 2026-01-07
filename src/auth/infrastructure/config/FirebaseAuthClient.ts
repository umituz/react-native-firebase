/**
 * Firebase Auth Client - Infrastructure Layer
 */

import type { Auth } from 'firebase/auth';
import { getFirebaseApp } from '../../../infrastructure/config/FirebaseClient';
import { FirebaseAuthInitializer } from './initializers/FirebaseAuthInitializer';
import type { FirebaseAuthConfig } from '../../domain/value-objects/FirebaseAuthConfig';

declare const __DEV__: boolean;

class FirebaseAuthClientSingleton {
  private static instance: FirebaseAuthClientSingleton | null = null;
  private auth: Auth | null = null;
  private initializationError: string | null = null;

  static getInstance(): FirebaseAuthClientSingleton {
    if (!this.instance) this.instance = new FirebaseAuthClientSingleton();
    return this.instance;
  }

  initialize(config?: FirebaseAuthConfig): Auth | null {
    if (this.auth) return this.auth;
    if (this.initializationError) return null;

    try {
      const app = getFirebaseApp();
      if (!app) return null;
      this.auth = FirebaseAuthInitializer.initialize(app, config);
      return this.auth;
    } catch (error: any) {
      if (__DEV__) console.error('[FirebaseAuth] Init error:', error.message);
      this.initializationError = error.message;
      return null;
    }
  }

  getAuth(): Auth | null {
    if (!this.auth && !this.initializationError && getFirebaseApp()) this.initialize();
    return this.auth;
  }

  reset(): void { this.auth = null; this.initializationError = null; }
}

export const firebaseAuthClient = FirebaseAuthClientSingleton.getInstance();
export const initializeFirebaseAuth = (c?: FirebaseAuthConfig) => firebaseAuthClient.initialize(c);
export const getFirebaseAuth = () => firebaseAuthClient.getAuth();
export const isFirebaseAuthInitialized = () => firebaseAuthClient.getAuth() !== null;
export const getFirebaseAuthInitializationError = () => firebaseAuthClient.initialize() ? null : "Not initialized"; 
export const resetFirebaseAuthClient = () => firebaseAuthClient.reset();

export type { Auth } from 'firebase/auth';
export type { FirebaseAuthConfig } from '../../domain/value-objects/FirebaseAuthConfig';
