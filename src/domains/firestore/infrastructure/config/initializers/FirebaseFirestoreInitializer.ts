/**
 * Firebase Firestore Initializer for React Native
 *
 * Simple initialization for Firestore in React Native apps.
 */

import { getFirestore, initializeFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';

/**
 * Initializes Firestore for React Native
 *
 * @param app - Firebase app instance
 * @returns Firestore instance
 *
 * @example
 * ```typescript
 * import { initializeApp } from 'firebase/app';
 * import { FirebaseFirestoreInitializer } from '@umituz/react-native-firebase/firestore';
 *
 * const app = initializeApp(firebaseConfig);
 * const db = FirebaseFirestoreInitializer.initialize(app);
 * ```
 */
export class FirebaseFirestoreInitializer {
  /**
   * Initialize Firestore
   */
  static initialize(app: FirebaseApp): Firestore {
    try {
      return initializeFirestore(app, {});
    } catch (error) {
      // If initialization fails, get existing instance
      if (__DEV__) {
        console.warn('[Firestore] Using existing instance:', error);
      }
      return getFirestore(app);
    }
  }
}
