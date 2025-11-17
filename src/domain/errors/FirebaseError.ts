/**
 * Firebase Domain Errors
 *
 * Domain-Driven Design: Error types for Firebase operations
 */

/**
 * Base Firebase Error
 */
export class FirebaseError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = 'FirebaseError';
    Object.setPrototypeOf(this, FirebaseError.prototype);
  }
}

/**
 * Initialization Error
 * Thrown when Firebase client fails to initialize
 */
export class FirebaseInitializationError extends FirebaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'INITIALIZATION_ERROR', originalError);
    this.name = 'FirebaseInitializationError';
    Object.setPrototypeOf(this, FirebaseInitializationError.prototype);
  }
}

/**
 * Configuration Error
 * Thrown when required configuration is missing or invalid
 */
export class FirebaseConfigurationError extends FirebaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'CONFIGURATION_ERROR', originalError);
    this.name = 'FirebaseConfigurationError';
    Object.setPrototypeOf(this, FirebaseConfigurationError.prototype);
  }
}

// Note: FirebaseAnalyticsError, FirebaseCrashlyticsError, FirebaseAuthError, and FirebaseFirestoreError
// have been moved to their respective packages:
// - @umituz/react-native-firebase-analytics
// - @umituz/react-native-firebase-crashlytics
// - @umituz/react-native-firebase-auth
// - @umituz/react-native-firestore





