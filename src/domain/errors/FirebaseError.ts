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

/**
 * Analytics Error
 * Thrown when analytics operations fail
 */
export class FirebaseAnalyticsError extends FirebaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'ANALYTICS_ERROR', originalError);
    this.name = 'FirebaseAnalyticsError';
    Object.setPrototypeOf(this, FirebaseAnalyticsError.prototype);
  }
}

/**
 * Crashlytics Error
 * Thrown when crashlytics operations fail
 */
export class FirebaseCrashlyticsError extends FirebaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'CRASHLYTICS_ERROR', originalError);
    this.name = 'FirebaseCrashlyticsError';
    Object.setPrototypeOf(this, FirebaseCrashlyticsError.prototype);
  }
}

/**
 * Auth Error
 * Thrown when authentication operations fail
 */
export class FirebaseAuthError extends FirebaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'AUTH_ERROR', originalError);
    this.name = 'FirebaseAuthError';
    Object.setPrototypeOf(this, FirebaseAuthError.prototype);
  }
}

/**
 * Firestore Error
 * Thrown when Firestore operations fail
 */
export class FirebaseFirestoreError extends FirebaseError {
  constructor(message: string, originalError?: unknown) {
    super(message, 'FIRESTORE_ERROR', originalError);
    this.name = 'FirebaseFirestoreError';
    Object.setPrototypeOf(this, FirebaseFirestoreError.prototype);
  }
}

