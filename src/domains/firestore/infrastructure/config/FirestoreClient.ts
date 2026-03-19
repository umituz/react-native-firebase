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

// Firestore type - use 'any' to avoid type conflicts with Firebase SDK
// The actual type checking happens in your app when you import from firebase/firestore
export type Firestore = any;
