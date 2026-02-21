/**
 * Firebase Auth Initializer
 *
 * Single Responsibility: Initialize Firebase Auth instance
 * Platform-agnostic: Works on all platforms (Web, iOS, Android)
 */

import {
  initializeAuth,
  getAuth,
  // @ts-expect-error: getReactNativePersistence exists in the React Native bundle but missing from type definitions
  // See: https://github.com/firebase/firebase-js-sdk/issues/9316
  getReactNativePersistence,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import type { FirebaseAuthConfig } from '../../../domain/value-objects/FirebaseAuthConfig';

/**
 * Initializes Firebase Auth
 * Platform-agnostic: Works on all platforms (Web, iOS, Android)
 */
export class FirebaseAuthInitializer {
  /**
   * Initialize Firebase Auth with persistence support
   */
  static initialize(app: FirebaseApp, config?: FirebaseAuthConfig): Auth | null {
    try {
      const auth = this.initializeWithPersistence(app, config);
      return auth;
    } catch (error: unknown) {
      return this.handleInitializationError(error, app);
    }
  }

  private static handleInitializationError(error: unknown, app: FirebaseApp): Auth | null {
    // Any initialization error: try to get existing auth instance
    return this.getExistingAuth(app);
  }

  private static getExistingAuth(app: FirebaseApp): Auth | null {
    try {
      return getAuth(app);
    } catch {
      return null;
    }
  }

  private static initializeWithPersistence(
    app: FirebaseApp,
    config?: FirebaseAuthConfig
  ): Auth | null {
    try {
      const storage = config?.authStorage || {
        getItem: (key: string) => AsyncStorage.getItem(key),
        setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
        removeItem: (key: string) => AsyncStorage.removeItem(key),
      };

      return initializeAuth(app, {
        persistence: getReactNativePersistence(storage),
      });
    } catch {
      return this.getExistingAuth(app);
    }
  }
}
