/**
 * Firebase Configuration Value Object
 *
 * Domain-Driven Design: Value object for Firebase configuration
 */

/**
 * Firebase Configuration
 * Required configuration for initializing Firebase client
 */
export interface FirebaseConfig {
  /**
   * Firebase API Key
   */
  apiKey: string;

  /**
   * Firebase Auth Domain
   */
  authDomain: string;

  /**
   * Firebase Project ID
   */
  projectId: string;

  /**
   * Firebase Storage Bucket
   */
  storageBucket?: string;

  /**
   * Firebase Messaging Sender ID
   */
  messagingSenderId?: string;

  /**
   * Firebase App ID
   */
  appId?: string;

  /**
   * Optional: Custom storage adapter for Auth persistence
   * If not provided, AsyncStorage will be used for React Native
   */
  authStorage?: {
    getItem: (key: string) => Promise<string | null>;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
  };
}

// Validation moved to FirebaseConfigValidator class (SOLID: Single Responsibility)

