/**
 * Firestore Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firestore client
 * Singleton pattern for managing Firestore instance
 */

import type { Firestore } from 'firebase/firestore';
import { getFirestore as getFirestoreFromFirebase } from 'firebase/firestore';
import { getFirebaseApp } from '../../../../shared/infrastructure/config/services/FirebaseInitializationService';
import { ServiceClientSingleton } from '../../../../shared/infrastructure/config/base/ServiceClientSingleton';

/**
 * Firestore Client Singleton
 * Manages Firestore initialization
 */
class FirestoreClientSingleton extends ServiceClientSingleton<Firestore> {
  private constructor() {
    super();
  }

  initialize(): Firestore {
    try {
      const app = getFirebaseApp();
      if (!app) {
        this.setError('Firebase App is not initialized');
        throw new Error('Firebase App is not initialized');
      }

      const firestore = getFirestoreFromFirebase(app);
      this.instance = firestore;
      return firestore;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Firestore initialization failed';
      this.setError(errorMessage);
      throw error;
    }
  }

  getFirestore(): Firestore {
    if (!this.isInitialized()) {
      return this.initialize();
    }
    return this.getInstance();
  }

  private static instance: FirestoreClientSingleton | null = null;

  static getInstance(): FirestoreClientSingleton {
    if (!this.instance) {
      this.instance = new FirestoreClientSingleton();
    }
    return this.instance;
  }
}

const firestoreClientSingleton = FirestoreClientSingleton.getInstance();

export const initializeFirestore = (): Firestore => {
  return firestoreClientSingleton.initialize();
};

export const getFirestore = (): Firestore => {
  return firestoreClientSingleton.getFirestore();
};

export const isFirestoreInitialized = (): boolean => {
  return firestoreClientSingleton.isInitialized();
};

export const getFirestoreInitializationError = (): Error | null => {
  return firestoreClientSingleton.getInitializationError();
};

export const resetFirestoreClient = (): void => {
  firestoreClientSingleton.reset();
};

export type { Firestore } from 'firebase/firestore';
