/**
 * Firebase Domain Errors
 *
 * Domain-Driven Design: Specialized error types for the Firebase domain
 */

if (__DEV__) {
  console.log('📍 [LIFECYCLE] FirebaseError.ts - Module loading');
}

/**
 * Base Firebase error class
 */
export class FirebaseError extends Error {
    constructor(message: string, public code?: string, public cause?: unknown) {
        super(message);
        this.name = 'FirebaseError';
        Object.setPrototypeOf(this, FirebaseError.prototype);
    }
}

/**
 * Initialization specific error
 */
export class FirebaseInitializationError extends FirebaseError {
    constructor(message: string, cause?: unknown) {
        super(message, 'INITIALIZATION_ERROR', cause);
        this.name = 'FirebaseInitializationError';
        Object.setPrototypeOf(this, FirebaseInitializationError.prototype);
    }
}

/**
 * Configuration specific error
 */
export class FirebaseConfigurationError extends FirebaseError {
    constructor(message: string, cause?: unknown) {
        super(message, 'CONFIGURATION_ERROR', cause);
        this.name = 'FirebaseConfigurationError';
        Object.setPrototypeOf(this, FirebaseConfigurationError.prototype);
    }
}
