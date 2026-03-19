/**
 * Firestore Configuration Client
 *
 * IMPORTANT: Does NOT import from firebase/firestore.
 * Import firebase SDK in your app and initialize it there.
 *
 * This client only provides type definitions and initialization helpers.
 */

import { FirebaseInitializationError } from "../../../../shared/domain/errors/FirebaseError";

export interface Firestore {
  app: unknown; // FirebaseApp from firebase/app
}

let firestoreInstance: Firestore | null = null;
let initializationError: Error | null = null;

/**
 * Initialize Firestore
 * Note: This is a placeholder. You should initialize Firestore in your app using:
 * import { initializeFirestore } from 'firebase/firestore';
 * import { getReactNativePersistence } from 'firebase/firestore/react-native';
 */
export async function initializeFirestore(
  firebaseApp: unknown // FirebaseApp from firebase/app
): Promise<Firestore> {
  if (firestoreInstance) {
    return firestoreInstance;
  }

  try {
    // In a real app, you would do:
    // const { getFirestore, initializeFirestore } = await import('firebase/firestore');
    // const { getReactNativePersistence } = await import('firebase/firestore/react-native');
    // const persistence = getReactNativePersistence();
    // firestoreInstance = initializeFirestore(firebaseApp, {
    //   localCache: persistence
    // });

    // For now, this is a placeholder that assumes firestore is initialized elsewhere
    throw new FirebaseInitializationError(
      "Firestore must be initialized in your app using firebase/firestore SDK. " +
      "Use initializeFirestore() from 'firebase/firestore' with React Native persistence."
    );
  } catch (error) {
    initializationError = error as Error;
    throw error;
  }
}

/**
 * Get Firestore instance
 * Returns null if not initialized
 */
export function getFirestore(): Firestore | null {
  return firestoreInstance;
}

/**
 * Check if Firestore is initialized
 */
export function isFirestoreInitialized(): boolean {
  return firestoreInstance !== null;
}

/**
 * Get Firestore initialization error
 */
export function getFirestoreInitializationError(): Error | null {
  return initializationError;
}

/**
 * Reset Firestore client state
 */
export function resetFirestoreClient(): void {
  firestoreInstance = null;
  initializationError = null;
}
