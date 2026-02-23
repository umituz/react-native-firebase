/**
 * Firebase Config Loader
 *
 * Automatically loads Firebase configuration from:
 * 1. expo-constants (Constants.expoConfig?.extra)
 * 2. Environment variables (process.env)
 */

import type { FirebaseConfig } from '../../domain/value-objects/FirebaseConfig';
import { isValidString } from '../../domain/utils/validators/string.validator';
import { isValidFirebaseApiKey, isValidFirebaseAuthDomain } from '../../domain/utils/validators/firebase.validator';

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
    if (isValidString(value)) return value;
  }
  return '';
}

/**
 * Load configuration from expo-constants
 */
function loadExpoConfig(): Record<string, unknown> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Constants = require('expo-constants');
    const expoConfig = Constants?.expoConfig || Constants?.default?.expoConfig;
    return expoConfig?.extra || {};
  } catch {
    return {};
  }
}

/**
 * Get config value from expo constants.
 * Supports two formats in app.json extra:
 *   1. Flat:   extra.firebaseApiKey  (preferred)
 *   2. Nested: extra.firebase.apiKey (legacy fallback)
 */
function getExpoValue(key: ConfigKey, expoConfig: Record<string, unknown>): string {
  const flatMapping: Record<ConfigKey, string> = {
    apiKey: 'firebaseApiKey',
    authDomain: 'firebaseAuthDomain',
    projectId: 'firebaseProjectId',
    storageBucket: 'firebaseStorageBucket',
    messagingSenderId: 'firebaseMessagingSenderId',
    appId: 'firebaseAppId',
  };

  // 1. Flat key: extra.firebaseApiKey
  const flat = expoConfig[flatMapping[key]];
  if (typeof flat === 'string' && flat) return flat;

  // 2. Nested key: extra.firebase.apiKey
  const nested = expoConfig['firebase'];
  if (nested && typeof nested === 'object') {
    const val = (nested as Record<string, unknown>)[key];
    if (typeof val === 'string' && val) return val;
  }

  return '';
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

  if (!isValidString(apiKey) || !isValidString(authDomain) || !isValidString(projectId)) {
    if (__DEV__) {
      console.warn('[Firebase] Missing required config (apiKey, authDomain, or projectId). Set EXPO_PUBLIC_FIREBASE_* env vars.');
    }
    return null;
  }

  if (!isValidFirebaseApiKey(apiKey)) {
    if (__DEV__) {
      console.warn('[Firebase] Invalid Firebase API key format.');
    }
    return null;
  }

  if (!isValidFirebaseAuthDomain(authDomain)) {
    if (__DEV__) {
      console.warn('[Firebase] Invalid Firebase authDomain format.');
    }
    return null;
  }

  // Build type-safe FirebaseConfig object
  return {
    apiKey,
    authDomain,
    projectId,
    storageBucket: config.storageBucket || undefined,
    messagingSenderId: config.messagingSenderId || undefined,
    appId: config.appId || undefined,
  };
}
