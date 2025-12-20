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
 * Configuration source interface
 */
interface ConfigSource {
  getApiKey(): string;
  getAuthDomain(): string;
  getProjectId(): string;
  getStorageBucket(): string;
  getMessagingSenderId(): string;
  getAppId(): string;
}

/**
 * Expo Constants configuration source
 */
class ExpoConfigSource implements ConfigSource {
  private extra: any;

  constructor() {
    let Constants: any;
    
    try {
      Constants = require('expo-constants');
    } catch {
      // expo-constants not available
    }

    const expoConfig = Constants?.expoConfig || Constants?.default?.expoConfig;
    this.extra = expoConfig?.extra || {};
  }

  getApiKey(): string {
    return this.extra?.firebaseApiKey || '';
  }

  getAuthDomain(): string {
    return this.extra?.firebaseAuthDomain || '';
  }

  getProjectId(): string {
    return this.extra?.firebaseProjectId || '';
  }

  getStorageBucket(): string {
    return this.extra?.firebaseStorageBucket || '';
  }

  getMessagingSenderId(): string {
    return this.extra?.firebaseMessagingSenderId || '';
  }

  getAppId(): string {
    return this.extra?.firebaseAppId || '';
  }
}

/**
 * Environment variables configuration source
 */
class EnvironmentConfigSource implements ConfigSource {
  getApiKey(): string {
    return process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 
           process.env.FIREBASE_API_KEY || 
           '';
  }

  getAuthDomain(): string {
    return process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 
           process.env.FIREBASE_AUTH_DOMAIN || 
           '';
  }

  getProjectId(): string {
    return process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 
           process.env.FIREBASE_PROJECT_ID || 
           '';
  }

  getStorageBucket(): string {
    return process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 
           process.env.FIREBASE_STORAGE_BUCKET || 
           '';
  }

  getMessagingSenderId(): string {
    return process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 
           process.env.FIREBASE_MESSAGING_SENDER_ID || 
           '';
  }

  getAppId(): string {
    return process.env.EXPO_PUBLIC_FIREBASE_APP_ID || 
           process.env.FIREBASE_APP_ID || 
           '';
  }
}

/**
 * Configuration aggregator
 */
class ConfigAggregator {
  private sources: ConfigSource[];

  constructor() {
    this.sources = [
      new ExpoConfigSource(),
      new EnvironmentConfigSource(),
    ];
  }

  /**
   * Get configuration value from first available source
   */
  private getValue(getter: (source: ConfigSource) => string): string {
    for (const source of this.sources) {
      const value = getter(source);
      if (value && value.trim() !== '') {
        return value;
      }
    }
    return '';
  }

  /**
   * Build Firebase configuration from all sources
   */
  buildConfig(): Partial<FirebaseConfig> {
    return {
      apiKey: this.getValue(source => source.getApiKey()),
      authDomain: this.getValue(source => source.getAuthDomain()),
      projectId: this.getValue(source => source.getProjectId()),
      storageBucket: this.getValue(source => source.getStorageBucket()),
      messagingSenderId: this.getValue(source => source.getMessagingSenderId()),
      appId: this.getValue(source => source.getAppId()),
    };
  }
}

/**
 * Load Firebase configuration from Constants and environment variables
 * Returns null if no valid configuration is found
 */
export function loadFirebaseConfig(): FirebaseConfig | null {
  const aggregator = new ConfigAggregator();
  const config = aggregator.buildConfig();

  // Only return config if required fields are present and not empty
  if (
    config.apiKey &&
    config.projectId &&
    config.apiKey.trim() !== '' &&
    config.projectId.trim() !== ''
  ) {
    return config as FirebaseConfig;
  }

  return null;
}

