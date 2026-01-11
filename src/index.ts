/**
 * React Native Firebase - Unified Package
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * Core exports - App initialization and shared utilities
 *
 * Module-specific exports available via:
 * - @umituz/react-native-firebase/auth
 * - @umituz/react-native-firebase/firestore
 * - @umituz/react-native-firebase/storage
 */

if (__DEV__) {
  console.log('📍 [LIFECYCLE] @umituz/react-native-firebase/index.ts - START');
}

// Core Errors
export {
  FirebaseError,
  FirebaseInitializationError,
  FirebaseConfigurationError,
} from './domain/errors/FirebaseError';

if (__DEV__) {
  console.log('📍 [LIFECYCLE] @umituz/react-native-firebase/index.ts - Core errors exported');
}

// Core Types
export type { FirebaseConfig } from './domain/value-objects/FirebaseConfig';
export type { IFirebaseClient } from './application/ports/IFirebaseClient';

// Core Client
export {
  initializeFirebase,
  getFirebaseApp,
  autoInitializeFirebase,
  initializeAllFirebaseServices,
  isFirebaseInitialized,
  getFirebaseInitializationError,
  resetFirebaseClient,
  firebaseClient,
} from './infrastructure/config/FirebaseClient';

export type {
  FirebaseApp,
  AuthInitializer,
  ServiceInitializationOptions,
  ServiceInitializationResult,
} from './infrastructure/config/FirebaseClient';

// Type Guards
export {
  isFirestoreError,
  isAuthError,
  isNetworkError,
  isPermissionDeniedError,
  isNotFoundError,
  isQuotaExceededError,
  getSafeErrorMessage,
  getSafeErrorCode,
} from './domain/guards/firebase-error.guard';

// Commonly Used Auth Exports (for convenience)
export {
  getFirebaseAuth,
  initializeFirebaseAuth,
} from './auth/infrastructure/config/FirebaseAuthClient';

export { anonymousAuthService } from './auth/infrastructure/services/anonymous-auth.service';
export { deleteCurrentUser } from './auth/infrastructure/services/account-deletion.service';

// Commonly Used Firestore Exports (for convenience)
export {
  getFirestore,
  initializeFirestore,
} from './firestore/infrastructure/config/FirestoreClient';

export { BaseRepository } from './firestore/infrastructure/repositories/BaseRepository';
export { FirestorePathResolver } from './firestore/utils/path-resolver';

// Auth Hooks (commonly used)
export { useSocialAuth } from './auth/presentation/hooks/useSocialAuth';
export type {
  SocialAuthConfig,
  SocialAuthResult,
} from './auth/presentation/hooks/useSocialAuth';
