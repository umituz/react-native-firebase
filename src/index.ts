/**
 * React Native Firebase - Unified Package
 *
 * Domain-Driven Design (DDD) Architecture
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
} from "./shared/infrastructure/config/services/FirebaseInitializationService";

export type {
  AuthInitializer,
  ServiceInitializationOptions,
  ServiceInitializationResult,
} from "./shared/infrastructure/config/services/FirebaseInitializationService";

export type { FirebaseApp } from "./shared/infrastructure/config/initializers/FirebaseAppInitializer";

import { FirebaseClientSingleton } from "./shared/infrastructure/config/clients/FirebaseClientSingleton";
export const firebaseClient = FirebaseClientSingleton.getInstance();

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
export * from "./domains/firestore";
export type {
  Transaction,
  DocumentReference,
  WriteBatch,
  DocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";

// Init Module Factory
export {
  createFirebaseInitModule,
  type FirebaseInitModuleConfig,
} from "./init";
