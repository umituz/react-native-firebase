/**
 * Firebase Auth Initializer
 *
 * Single Responsibility: Initialize Firebase Auth instance
 */

import { initializeAuth, getAuth } from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import type { FirebaseConfig } from '../../../domain/value-objects/FirebaseConfig';

/**
 * Initializes Firebase Auth
 */
export class FirebaseAuthInitializer {
  /**
   * Initialize Firebase Auth with platform-specific persistence
   */
  static initialize(app: FirebaseApp, config: FirebaseConfig): Auth {
    try {
      if (Platform.OS === 'web') {
        return getAuth(app);
      }

      // Try React Native persistence
      return this.initializeWithPersistence(app, config);
    } catch (error: any) {
      // If already initialized, get existing instance
      if (error.code === 'auth/already-initialized') {
        return getAuth(app);
      }

      /* eslint-disable-next-line no-console */
      if (__DEV__) console.warn('Firebase Auth initialization error:', error);
      return getAuth(app);
    }
  }

  private static initializeWithPersistence(
    app: FirebaseApp,
    config: FirebaseConfig
  ): Auth {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const authModule = require('firebase/auth');
      const getReactNativePersistence = authModule.getReactNativePersistence;

      if (!getReactNativePersistence) {
        return getAuth(app);
      }

      const storage = config.authStorage || {
        getItem: (key: string) => AsyncStorage.getItem(key),
        setItem: (key: string, value: string) => AsyncStorage.setItem(key, value),
        removeItem: (key: string) => AsyncStorage.removeItem(key),
      };

      return initializeAuth(app, {
        persistence: getReactNativePersistence(storage),
      });
    } catch {
      return getAuth(app);
    }
  }
}

