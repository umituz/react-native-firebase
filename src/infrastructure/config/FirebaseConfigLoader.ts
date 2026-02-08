/**
 * Firebase Config Loader
 *
 * Automatically loads Firebase configuration from:
 * 1. expo-constants (Constants.expoConfig?.extra)
 * 2. Environment variables (process.env)
 */

import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';

type ConfigKey = 'apiKey' | 'authDomain' | 'projectId' | 'storageBucket' | 'messagingSenderId' | 'appId';

const EXPO_PREFIX = 'EXPO_PUBLIC_';
const ENV_KEYS: Record<ConfigKey, string[]> = {
  apiKey: ['FIREBASE_API_KEY'],
  authDomain: ['FIREBASE_AUTH_DOMAIN'],
  projectId: ['FIREBASE_PROJECT_ID'],
  storageBucket: ['FIREBASE_STORAGE_BUCKET'],
  messagingSenderId: ['FIREBASE_MESSAGING_SENDER_ID'],
  appId: ['FIREBASE_APP_ID'],
};

/**
 * Get environment variable value
 */
function getEnvValue(key: ConfigKey): string {
  const keys = ENV_KEYS[key];
  for (const envKey of keys) {
    const value = process.env[`${EXPO_PREFIX}${envKey}`] || process.env[envKey];
    if (value?.trim()) return value;
  }
  return '';
}

/**
 * Load configuration from expo-constants
 */
function loadExpoConfig(): Record<string, string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Constants = require('expo-constants');
    const expoConfig = Constants?.expoConfig || Constants?.default?.expoConfig;
    return expoConfig?.extra || {};
  } catch (error) {
    if (__DEV__) console.warn('[FirebaseConfigLoader] expo-constants not available:', error);
    return {};
  }
}

/**
 * Get config value from expo constants
 */
function getExpoValue(key: ConfigKey, expoConfig: Record<string, string>): string {
  const mapping: Record<ConfigKey, string> = {
    apiKey: 'firebaseApiKey',
    authDomain: 'firebaseAuthDomain',
    projectId: 'firebaseProjectId',
    storageBucket: 'firebaseStorageBucket',
    messagingSenderId: 'firebaseMessagingSenderId',
    appId: 'firebaseAppId',
  };
  return expoConfig[mapping[key]] || '';
}

/**
 * Validate Firebase API key format
 */
function validateApiKey(apiKey: string): boolean {
  // Firebase API keys typically start with "AIza" followed by 35 characters
  const apiKeyPattern = /^AIza[0-9A-Za-z_-]{35}$/;
  return apiKeyPattern.test(apiKey);
}

/**
 * Load Firebase configuration from Constants and environment variables
 */
export function loadFirebaseConfig(): FirebaseConfig | null {
  const expoConfig = loadExpoConfig();

  const config: Partial<Record<ConfigKey, string>> = {};
  const keys: ConfigKey[] = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

  for (const key of keys) {
    const expoValue = getExpoValue(key, expoConfig);
    config[key] = expoValue || getEnvValue(key);
  }

  // Validate required fields with proper checks
  const apiKey = config.apiKey?.trim();
  const authDomain = config.authDomain?.trim();
  const projectId = config.projectId?.trim();

  if (!apiKey || !authDomain || !projectId) {
    if (__DEV__) {
      console.error('[FirebaseConfigLoader] Missing required configuration fields');
    }
    return null;
  }

  // Validate API key format
  if (!validateApiKey(apiKey)) {
    if (__DEV__) {
      console.error('[FirebaseConfigLoader] Invalid API key format');
    }
    return null;
  }

  // Validate authDomain format (should be like "projectId.firebaseapp.com")
  if (!authDomain.includes('.firebaseapp.com') && !authDomain.includes('.web.app')) {
    if (__DEV__) {
      console.warn('[FirebaseConfigLoader] Unusual authDomain format, expected "projectId.firebaseapp.com" or similar');
    }
  }

  return config as FirebaseConfig;
}

