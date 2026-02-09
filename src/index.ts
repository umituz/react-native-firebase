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

// Auth Module Exports
export * from "./auth";



// Firestore Module Exports
export {
  BaseRepository,
  BaseQueryRepository,
  BasePaginatedRepository,
  FirestorePathResolver,
} from "./firestore";
export * from "./firestore";
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
  withFirestore,
  withFirestoreVoid,
  withFirestoreBool,
  createErrorResult,
  createSuccessResult,
  runTransaction,
  serverTimestamp,
} from "./firestore/utils/firestore-helper";
export type { FirestoreResult, NoDbResult } from "./firestore/utils/firestore-helper";

// Init Module Factory
export {
  createFirebaseInitModule,
  type FirebaseInitModuleConfig,
} from "./init";
