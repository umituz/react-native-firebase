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
    if (__DEV__) console.log('[Firebase Auth] Initializing...');

    try {
      const auth = this.initializeWithPersistence(app, config);

      if (auth && __DEV__) {
        console.log('[Firebase Auth] Successfully initialized');
      }

      return auth;
    } catch (error: unknown) {
      return this.handleInitializationError(error, app);
    }
  }

  private static handleInitializationError(error: unknown, app: FirebaseApp): Auth | null {
    const errorCode = (error as { code?: string })?.code;

    if (errorCode === 'auth/already-initialized') {
      if (__DEV__) console.log('[Firebase Auth] Already initialized, returning existing instance');
      return this.getExistingAuth(app);
    }

    if (__DEV__) {
      console.warn('[Firebase Auth] Initialization error:', error);
    }

    return this.getExistingAuth(app);
  }

  private static getExistingAuth(app: FirebaseApp): Auth | null {
    try {
      return getAuth(app);
    } catch (getAuthError) {
      if (__DEV__) {
        console.warn('[Firebase Auth] Failed to get auth instance:', getAuthError);
      }
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

      if (__DEV__) console.log('[Firebase Auth] Initializing with AsyncStorage persistence');

      return initializeAuth(app, {
        persistence: getReactNativePersistence(storage),
      });
    } catch (error) {
      if (__DEV__) {
        console.warn('[Firebase Auth] Persistence initialization failed:', error);
      }

      return this.getExistingAuth(app);
    }
  }
}
