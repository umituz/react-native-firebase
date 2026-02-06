/**
 * Firestore Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firestore client
 * Singleton pattern for managing Firestore instance
 *
 * IMPORTANT: This package requires Firebase App to be initialized first.
 * Use @umituz/react-native-firebase to initialize Firebase App.
 */

if (__DEV__) console.log("📍 [LIFECYCLE] FirestoreClient.ts - Module loading");

import type { Firestore } from 'firebase/firestore';
import { getFirebaseApp } from '../../../infrastructure/config/FirebaseClient';
import { FirebaseFirestoreInitializer } from './initializers/FirebaseFirestoreInitializer';

/**
 * Firestore Client Singleton
 * Manages Firestore initialization
 */
class FirestoreClientSingleton {
  private static instance: FirestoreClientSingleton | null = null;
  private firestore: Firestore | null = null;
  private initializationError: string | null = null;

  private constructor() {}

  static getInstance(): FirestoreClientSingleton {
    if (!FirestoreClientSingleton.instance) {
      FirestoreClientSingleton.instance = new FirestoreClientSingleton();
    }
    return FirestoreClientSingleton.instance;
  }

  initialize(): Firestore | null {
    if (this.firestore) return this.firestore;
    if (this.initializationError) return null;

    try {
      const app = getFirebaseApp();
      if (!app) return null;

      this.firestore = FirebaseFirestoreInitializer.initialize(app);
      return this.firestore;
    } catch (error) {
      this.initializationError =
        error instanceof Error
          ? error.message
          : 'Failed to initialize Firestore client';
      return null;
    }
  }

  getFirestore(): Firestore | null {
    if (!this.firestore && !this.initializationError) {
      const app = getFirebaseApp();
      if (app) this.initialize();
    }
    return this.firestore || null;
  }

  isInitialized(): boolean {
    return this.firestore !== null;
  }

  getInitializationError(): string | null {
    return this.initializationError;
  }

  reset(): void {
    this.firestore = null;
    this.initializationError = null;
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

