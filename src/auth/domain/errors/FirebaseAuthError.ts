/**
 * Firebase Auth Error Classes
 * Custom error types for Firebase Auth operations
 */

if (__DEV__) {
  console.log('📍 [LIFECYCLE] FirebaseAuthError.ts - Module loading');
}

export class FirebaseAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseAuthError';
  }
}

export class FirebaseAuthInitializationError extends FirebaseAuthError {
  constructor(message: string) {
    super(message);
    this.name = 'FirebaseAuthInitializationError';
  }
}
