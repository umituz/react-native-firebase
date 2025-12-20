/**
 * React Native Firebase - Unified Package
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * This package provides Firebase App initialization and core services:
 * - Analytics
 * - Crashlytics
 *
 * Usage:
 *   import { initializeFirebase, getFirebaseApp } from '@umituz/react-native-firebase';
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
} from './infrastructure/config/FirebaseClient';

// =============================================================================
// ANALYTICS MODULE
// =============================================================================

export * from './analytics';

// =============================================================================
// CRASHLYTICS MODULE
// =============================================================================

export * from './crashlytics';

