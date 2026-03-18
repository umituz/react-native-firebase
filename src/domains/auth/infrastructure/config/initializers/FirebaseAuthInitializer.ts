import {
  initializeAuth,
  getAuth,
  // @ts-expect-error: getReactNativePersistence exists in the React Native bundle but missing from type definitions
  getReactNativePersistence,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FirebaseApp } from 'firebase/app';
import type { FirebaseAuthConfig } from '../../../domain/value-objects/FirebaseAuthConfig';

export class FirebaseAuthInitializer {
  static initialize(app: FirebaseApp, config?: FirebaseAuthConfig): Auth | null {
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
      try {
        return getAuth(app);
      } catch {
        return null;
      }
    }
  }
}
