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
} from "./shared/domain/errors/FirebaseError";

// Core Types
export type { FirebaseConfig } from "./shared/domain/value-objects/FirebaseConfig";
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
} from "./shared/infrastructure/config/FirebaseClient";

export type {
  FirebaseApp,
  AuthInitializer,
  ServiceInitializationOptions,
  ServiceInitializationResult,
} from "./shared/infrastructure/config/FirebaseClient";

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
} from "./shared/domain/guards/firebase-error.guard";

// Domain Exports
export * from "./domains/auth";
export * from "./domains/account-deletion";



// Firestore Module Exports
export {
  BaseRepository,
  BaseQueryRepository,
  BasePaginatedRepository,
} from "./domains/firestore";
export * from "./domains/firestore";
export { Timestamp } from "firebase/firestore";
export type {
  Transaction,
  DocumentReference,
  CollectionReference,
  WriteBatch,
  DocumentSnapshot,
  QuerySnapshot,
  QueryDocumentSnapshot,
  DocumentData,
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
} from "./domains/firestore/utils/firestore-helper";
export type { NoDbResult } from "./domains/firestore/utils/firestore-helper";

// Init Module Factory
export {
  createFirebaseInitModule,
  type FirebaseInitModuleConfig,
} from "./init";
