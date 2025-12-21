/**
 * Firebase Auth Initializer
 *
 * Single Responsibility: Initialize Firebase Auth instance
 * Platform-agnostic: Works on all platforms (Web, iOS, Android)
 */

import { initializeAuth, getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import type { FirebaseAuthConfig } from '../../../domain/value-objects/FirebaseAuthConfig';
import {
  trackPackageError,
  addPackageBreadcrumb,
  trackPackageWarning,
} from '@umituz/react-native-sentry';

declare const __DEV__: boolean;

/**
 * Initializes Firebase Auth
 * Platform-agnostic: Works on all platforms (Web, iOS, Android)
 */
export class FirebaseAuthInitializer {
  /**
   * Initialize Firebase Auth with persistence support
   */
  static initialize(app: FirebaseApp, config?: FirebaseAuthConfig): Auth | null {
    addPackageBreadcrumb('firebase-auth', 'Initializing Firebase Auth');

    try {
      // Try React Native persistence first (works on all platforms)
      const auth = this.initializeWithPersistence(app, config);

      if (auth) {
        addPackageBreadcrumb('firebase-auth', 'Successfully initialized with persistence');
      }

      return auth;
    } catch (error: any) {
      // If already initialized or persistence fails, get existing instance
      if (error.code === 'auth/already-initialized') {
        trackPackageWarning(
          'firebase-auth',
          'Auth already initialized, returning existing instance',
          { errorCode: error.code }
        );

        try {
          return getAuth(app);
        } catch (getAuthError) {
          const errorObj = getAuthError instanceof Error ? getAuthError : new Error(String(getAuthError));
          trackPackageError(errorObj, {
            packageName: 'firebase-auth',
            operation: 'getAuth-after-already-initialized',
          });

          if (__DEV__) {
            console.warn('Firebase Auth: Failed to get existing auth instance:', getAuthError);
          }
          return null;
        }
      }

      const errorObj = error instanceof Error ? error : new Error(String(error));
      trackPackageError(errorObj, {
        packageName: 'firebase-auth',
        operation: 'initialize',
        errorCode: error.code,
      });

      if (__DEV__) {
        console.warn('Firebase Auth initialization error:', error);
      }

      // Try to get auth instance as fallback
      try {
        return getAuth(app);
      } catch (getAuthError) {
        const fallbackError = getAuthError instanceof Error ? getAuthError : new Error(String(getAuthError));
        trackPackageError(fallbackError, {
          packageName: 'firebase-auth',
          operation: 'getAuth-fallback',
        });

        if (__DEV__) {
          console.warn('Firebase Auth: Failed to get auth instance after initialization error:', getAuthError);
        }
        return null;
      }
    }
  }

  private static initializeWithPersistence(
    app: FirebaseApp,
    config?: FirebaseAuthConfig
  ): Auth | null {
    try {
      const authModule = require('firebase/auth');
      const getReactNativePersistence = authModule.getReactNativePersistence;

      if (!getReactNativePersistence) {
        trackPackageWarning(
          'firebase-auth',
          'getReactNativePersistence not available, using default persistence'
        );

        if (__DEV__) {
          console.log('Firebase Auth: getReactNativePersistence not available, using default persistence');
        }
        try {
          return getAuth(app);
        } catch {
          return null;
        }
      }

      const storage = config?.authStorage || {
        getItem: (key: string) => AsyncStorage.getItem(key),
        setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
        removeItem: (key: string) => AsyncStorage.removeItem(key),
      };

      addPackageBreadcrumb('firebase-auth', 'Initializing with AsyncStorage persistence');

      return initializeAuth(app, {
        persistence: getReactNativePersistence(storage),
      });
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      trackPackageError(errorObj, {
        packageName: 'firebase-auth',
        operation: 'initializeWithPersistence',
      });

      if (__DEV__) {
        console.warn('Firebase Auth: Persistence initialization failed:', error);
      }
      try {
        return getAuth(app);
      } catch {
        return null;
      }
    }
  }
}

