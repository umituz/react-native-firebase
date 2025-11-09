/**
 * Firebase Firestore Initializer
 *
 * Single Responsibility: Initialize Firestore instance
 */

import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { Platform } from 'react-native';
import type { FirebaseApp } from 'firebase/app';

/**
 * Initializes Firestore
 */
export class FirebaseFirestoreInitializer {
  /**
   * Initialize Firestore with platform-specific cache configuration
   */
  static initialize(app: FirebaseApp): Firestore {
    if (Platform.OS === 'web') {
      return this.initializeForWeb(app);
    }

    // React Native: Use default persistence
    return getFirestore(app);
  }

  private static initializeForWeb(app: FirebaseApp): Firestore {
    try {
      return initializeFirestore(app, {
        localCache: persistentLocalCache(),
      });
    } catch (error: any) {
      // If already initialized, get existing instance
      if (error.code === 'failed-precondition') {
        /* eslint-disable-next-line no-console */
        if (__DEV__)
          console.warn(
            'Firestore already initialized, using existing instance'
          );
        return getFirestore(app);
      }

      /* eslint-disable-next-line no-console */
      if (__DEV__) console.warn('Firestore initialization error:', error);
      return getFirestore(app);
    }
  }
}

