/**
 * Firebase Firestore Initializer
 *
 * Single Responsibility: Initialize Firestore instance
 *
 * NOTE: React Native does not support IndexedDB (browser API), so we use
 * memoryLocalCache instead of persistentLocalCache. For client-side caching,
 * use TanStack Query which works on all platforms.
 */

import {
  getFirestore,
  initializeFirestore,
  memoryLocalCache,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';

/**
 * Initializes Firestore
 * Platform-agnostic: Works on all platforms (Web, iOS, Android)
 */
export class FirebaseFirestoreInitializer {
  /**
   * Initialize Firestore with memory cache configuration
   * React Native does not support IndexedDB, so we use memory cache
   * For offline persistence, use TanStack Query with AsyncStorage
   */
  static initialize(app: FirebaseApp): Firestore {
    try {
      // Use memory cache for React Native compatibility
      // IndexedDB (persistentLocalCache) is not available in React Native
      return initializeFirestore(app, {
        localCache: memoryLocalCache(),
      });
    } catch (error: unknown) {
      // If already initialized, get existing instance
      return getFirestore(app);
    }
  }
}

