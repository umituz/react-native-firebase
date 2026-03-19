/**
 * Firestore Configuration Client
 *
 * IMPORTANT: This package does NOT provide Firestore initialization.
 * Use Firebase SDK directly in your app:
 * ```typescript
 * import { getFirestore, initializeFirestore } from 'firebase/firestore';
 * import { getReactNativePersistence } from 'firebase/firestore/react-native';
 * import AsyncStorage from '@react-native-async-storage/async-storage';
 *
 * const db = initializeFirestore(firebaseApp, {
 *   localCache: getReactNativePersistence(AsyncStorage)
 * });
 * ```
 *
 * This package only provides:
 * - Base repository classes (extend these for your data layer)
 * - Utilities for pagination, queries, dates
 * - Type definitions (import from 'firebase/firestore' in your app)
 */

import { getFirebaseApp } from '../../../../shared/infrastructure/config/services/FirebaseInitializationService';

// Firestore type - use 'any' to avoid type conflicts with Firebase SDK
// The actual type checking happens in your app when you import from firebase/firestore
export type Firestore = any;

/**
 * Get Firestore instance
 * Returns null if Firebase app is not initialized
 *
 * This is a convenience wrapper that gets the Firebase app and returns
 * a Firestore instance. For type safety, import Firestore from 'firebase/firestore'
 * in your app.
 *
 * @example
 * ```typescript
 * import { getDb } from '@umituz/react-native-firebase/firestore';
 * import type { Firestore } from 'firebase/firestore';
 *
 * const db = getDb() as Firestore | null;
 * if (db) {
 *   // Use db with Firebase SDK functions
 * }
 * ```
 */
export function getFirestore(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;

  // Import getFirestore from Firebase SDK dynamically
  // This avoids the idb dependency during bundling
  try {
    const firebaseFirestore = require('firebase/firestore');
    return firebaseFirestore.getFirestore(app);
  } catch (error) {
    console.warn('[Firestore] Failed to get Firestore instance:', error);
    return null;
  }
}
