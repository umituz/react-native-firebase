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

// Core Errors
export {
  FirebaseError,
  FirebaseInitializationError,
  FirebaseConfigurationError,
} from "./domain/errors/FirebaseError";

// Core Types
export type { FirebaseConfig } from "./domain/value-objects/FirebaseConfig";
export type { IFirebaseClient } from "./application/ports/IFirebaseClient";

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
} from "./infrastructure/config/FirebaseClient";

export type {
  FirebaseApp,
  AuthInitializer,
  ServiceInitializationOptions,
  ServiceInitializationResult,
} from "./infrastructure/config/FirebaseClient";

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
} from "./domain/guards/firebase-error.guard";

// Commonly Used Auth Exports (for convenience)
export {
  getFirebaseAuth,
  initializeFirebaseAuth,
} from "./auth/infrastructure/config/FirebaseAuthClient";

export { anonymousAuthService } from "./auth/infrastructure/services/anonymous-auth.service";
export { deleteCurrentUser } from "./auth/infrastructure/services/account-deletion.service";
export { appleAuthService } from "./auth/infrastructure/services/apple-auth.service";
export { googleAuthService } from "./auth/infrastructure/services/google-auth.service";
export type { GoogleAuthConfig } from "./auth/infrastructure/services/google-auth.types";
export { useAnonymousAuth } from "./auth/presentation/hooks/useAnonymousAuth";
export type { UseAnonymousAuthResult } from "./auth/presentation/hooks/useAnonymousAuth";

// Commonly Used Firestore Exports (for convenience)
export {
  getFirestore,
  initializeFirestore,
} from "./firestore/infrastructure/config/FirestoreClient";

export { BaseRepository } from "./firestore/infrastructure/repositories/BaseRepository";
export { FirestorePathResolver } from "./firestore/utils/path-resolver";
export { PaginationHelper } from "./firestore/utils/pagination.helper";

export { Timestamp } from "firebase/firestore";
export type {
  Transaction,
  DocumentReference,
  WriteBatch,
  DocumentSnapshot,
  QuerySnapshot,
  Firestore,
} from "firebase/firestore";

// Firestore Helper Utilities
export {
  getDb,
  withFirestore,
  withFirestoreVoid,
  withFirestoreBool,
  createErrorResult,
  createSuccessResult,
  runTransaction,
  serverTimestamp,
} from "./firestore/utils/firestore-helper";
export type { FirestoreResult, NoDbResult } from "./firestore/utils/firestore-helper";

// Auth Hooks (commonly used)
export { useSocialAuth } from "./auth/presentation/hooks/useSocialAuth";
export type {
  SocialAuthConfig,
  SocialAuthResult,
} from "./auth/presentation/hooks/useSocialAuth";

export { updateUserPassword } from "./auth/infrastructure/services/password.service";
export type { PasswordUpdateResult } from "./auth/infrastructure/services/password.service";

export { reauthenticateWithPassword } from "./auth/infrastructure/services/reauthentication.service";

export { getCurrentUserFromGlobal } from "./auth/infrastructure/services/auth-utils.service";

// Init Module Factory
export {
  createFirebaseInitModule,
  type FirebaseInitModuleConfig,
} from "./init";
