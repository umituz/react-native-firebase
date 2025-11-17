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
}

// Validation moved to FirebaseConfigValidator class (SOLID: Single Responsibility)

