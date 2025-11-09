/**
 * React Native Firebase - Public API
 *
 * Domain-Driven Design (DDD) Architecture
 *
 * This is the SINGLE SOURCE OF TRUTH for all Firebase operations.
 * ALL imports from the Firebase package MUST go through this file.
 *
 * Architecture:
 * - domain: Entities, value objects, errors (business logic)
 * - application: Ports (interfaces)
 * - infrastructure: Firebase client implementation
 * - presentation: Hooks (React integration)
 *
 * Usage:
 *   import { initializeFirebase, getFirebaseApp, useFirebase } from '@umituz/react-native-firebase';
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export {
  FirebaseError,
  FirebaseInitializationError,
  FirebaseConfigurationError,
  FirebaseAnalyticsError,
  FirebaseCrashlyticsError,
  FirebaseAuthError,
  FirebaseFirestoreError,
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
  getFirebaseAuth,
  getFirestore,
  isFirebaseInitialized,
  getFirebaseInitializationError,
  resetFirebaseClient,
  firebaseClient,
} from './infrastructure/config/FirebaseClient';

export type {
  FirebaseApp,
  Auth,
  Firestore,
} from './infrastructure/config/FirebaseClient';

