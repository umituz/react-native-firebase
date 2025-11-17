/**
 * Firebase Config Loader
 *
 * Automatically loads Firebase configuration from:
 * 1. expo-constants (Constants.expoConfig?.extra)
 * 2. Environment variables (process.env)
 *
 * This allows zero-configuration Firebase initialization.
 */

import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';

/**
 * Load Firebase configuration from Constants and environment variables
 * Returns null if no valid configuration is found
 */
export function loadFirebaseConfig(): FirebaseConfig | null {
  let Constants: any;
  
  // Try to load expo-constants (optional dependency)
  try {
    Constants = require('expo-constants');
  } catch {
    // expo-constants not available, skip
  }

  const config: Partial<FirebaseConfig> = {
    apiKey:
      Constants?.expoConfig?.extra?.firebaseApiKey ||
      process.env.EXPO_PUBLIC_FIREBASE_API_KEY ||
      process.env.FIREBASE_API_KEY ||
      '',
    authDomain:
      Constants?.expoConfig?.extra?.firebaseAuthDomain ||
      process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      process.env.FIREBASE_AUTH_DOMAIN ||
      '',
    projectId:
      Constants?.expoConfig?.extra?.firebaseProjectId ||
      process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.FIREBASE_PROJECT_ID ||
      '',
    storageBucket:
      Constants?.expoConfig?.extra?.firebaseStorageBucket ||
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.FIREBASE_STORAGE_BUCKET ||
      '',
    messagingSenderId:
      Constants?.expoConfig?.extra?.firebaseMessagingSenderId ||
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.FIREBASE_MESSAGING_SENDER_ID ||
      '',
    appId:
      Constants?.expoConfig?.extra?.firebaseAppId ||
      process.env.EXPO_PUBLIC_FIREBASE_APP_ID ||
      process.env.FIREBASE_APP_ID ||
      '',
  };

  // Only return config if required fields are present
  if (config.apiKey && config.projectId) {
    return config as FirebaseConfig;
  }

  return null;
}

