/**
 * React Native Firebase - Minimal Core Package
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * This package provides ONLY Firebase App initialization.
 * For other Firebase services, use dedicated packages:
 * - @umituz/react-native-firebase-auth - Firebase Authentication
 * - @umituz/react-native-firebase-analytics - Firebase Analytics
 * - @umituz/react-native-firebase-crashlytics - Firebase Crashlytics
 * - @umituz/react-native-firestore - Firestore initialization and utilities
 *
 * Architecture:
 * - domain: Entities, value objects, errors (business logic)
 * - application: Ports (interfaces)
 * - infrastructure: Firebase client implementation
 *
 * Usage:
 *   import { initializeFirebase, getFirebaseApp } from '@umituz/react-native-firebase';
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export {
  FirebaseError,
  FirebaseInitializationError,
  FirebaseConfigurationError,
} from './domain/errors/FirebaseError';

export type { FirebaseConfig } from './domain/value-objects/FirebaseConfig';

// =============================================================================
// APPLICATION LAYER - Ports
// =============================================================================

export type { IFirebaseClient } from './application/ports/IFirebaseClient';

// =============================================================================
// INFRASTRUCTURE LAYER - Implementation
// =============================================================================

export {
  initializeFirebase,
  getFirebaseApp,
  autoInitializeFirebase,
  isFirebaseInitialized,
  getFirebaseInitializationError,
  resetFirebaseClient,
  firebaseClient,
} from './infrastructure/config/FirebaseClient';

export type {
  FirebaseApp,
} from './infrastructure/config/FirebaseClient';

