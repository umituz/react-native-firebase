/**
 * React Native Firebase - Unified Package
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * This package provides Firebase App initialization and core services:
 * - Auth
 * - Firestore
 * - Analytics
 * - Crashlytics
 *
 * Usage:
 *   import { initializeFirebase, getFirebaseApp } from '@umituz/react-native-firebase';
 *   import { useFirebaseAuth } from '@umituz/react-native-firebase';
 *   import { getFirestore, BaseRepository } from '@umituz/react-native-firebase';
 *   import { firebaseAnalyticsService } from '@umituz/react-native-firebase';
 */

// =============================================================================
// CORE - App Initialization & Type Definitions
// =============================================================================

export {
  FirebaseError,
  FirebaseInitializationError,
  FirebaseConfigurationError,
} from './domain/errors/FirebaseError';

export type { FirebaseConfig } from './domain/value-objects/FirebaseConfig';
export type { IFirebaseClient } from './application/ports/IFirebaseClient';

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

// =============================================================================
// AUTH MODULE
// =============================================================================

export * from './auth';

// =============================================================================
// FIRESTORE MODULE
// =============================================================================

export * from './firestore';

// =============================================================================
// ANALYTICS MODULE
// =============================================================================

export * from './analytics';

// =============================================================================
// CRASHLYTICS MODULE
// =============================================================================

export * from './crashlytics';

