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
 * - infrastructure: Firebase client implementation + services
 * - presentation: Hooks, decorators (React integration)
 *
 * Usage:
 *   import { initializeFirebase, firebaseAnalyticsService, TrackEvent } from '@umituz/react-native-firebase';
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

// =============================================================================
// SERVICES - Analytics, Crashlytics, Performance
// =============================================================================

export {
  firebaseAnalyticsService,
} from './infrastructure/services/analytics/FirebaseAnalyticsService';
export type { IAnalyticsService } from './infrastructure/services/analytics/FirebaseAnalyticsService';

export {
  firebaseCrashlyticsService,
} from './infrastructure/services/crashlytics/FirebaseCrashlyticsService';
export type { ICrashlyticsService } from './infrastructure/services/crashlytics/FirebaseCrashlyticsService';

export {
  performanceTracker,
  PerformanceTracker,
} from './infrastructure/services/performance/PerformanceTracker';

// =============================================================================
// PRESENTATION LAYER - Decorators
// =============================================================================

export {
  TrackEvent,
  trackEvent,
} from './presentation/decorators/TrackingDecorator';

export {
  TrackErrors,
  trackErrors,
} from './presentation/decorators/ErrorTrackingDecorator';

export {
  TrackPerformance,
  TrackOperation,
} from './presentation/decorators/PerformanceDecorator';

