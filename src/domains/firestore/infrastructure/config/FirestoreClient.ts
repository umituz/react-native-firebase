/**
 * Firestore Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firestore client
 * Singleton pattern for managing Firestore instance
 *
 * IMPORTANT: This package requires Firebase App to be initialized first.
 * Use @umituz/react-native-firebase to initialize Firebase App.
 */

import type { Firestore } from 'firebase/firestore';
import { getFirebaseApp } from '../../../../shared/infrastructure/config/FirebaseClient';
import { FirebaseFirestoreInitializer } from './initializers/FirebaseFirestoreInitializer';
import { ServiceClientSingleton } from '../../../../shared/infrastructure/config/base/ServiceClientSingleton';

/**
 * Firestore Client Singleton
 * Manages Firestore initialization
 */
class FirestoreClientSingleton extends ServiceClientSingleton<Firestore> {
  private constructor() {
    super({
      serviceName: 'Firestore',
      initializer: () => {
        const app = getFirebaseApp();
        if (!app) {
          this.setError('Firebase App is not initialized');
          return null;
        }
        return FirebaseFirestoreInitializer.initialize(app);
      },
      autoInitializer: () => {
        const app = getFirebaseApp();
        if (!app) return null;
        return FirebaseFirestoreInitializer.initialize(app);
      },
    });
  }

  private static instance: FirestoreClientSingleton | null = null;

  static getInstance(): FirestoreClientSingleton {
    if (!this.instance) {
      this.instance = new FirestoreClientSingleton();
    }
    return this.instance;
  }

  /**
   * Initialize Firestore
   */
  override initialize(): Firestore | null {
    return super.initialize();
  }

  /**
   * Get Firestore instance with auto-initialization
   */
  getFirestore(): Firestore | null {
    return this.getInstance(true);
  }
}

export const firestoreClient = FirestoreClientSingleton.getInstance();

export function initializeFirestore(): Firestore | null {
  return firestoreClient.initialize();
}

export function getFirestore(): Firestore | null {
  return firestoreClient.getFirestore();
}

export function isFirestoreInitialized(): boolean {
  return firestoreClient.isInitialized();
}

export function getFirestoreInitializationError(): string | null {
  return firestoreClient.getInitializationError();
}

export function resetFirestoreClient(): void {
  firestoreClient.reset();
}

export type { Firestore } from 'firebase/firestore';
