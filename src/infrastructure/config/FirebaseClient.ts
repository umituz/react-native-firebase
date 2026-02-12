/**
 * Firebase Client - Infrastructure Layer
 *
 * Domain-Driven Design: Infrastructure implementation of Firebase client
 * Singleton pattern for managing Firebase client instance
 *
 * IMPORTANT: This package does NOT read from .env files.
 * Configuration must be provided by the application.
 *
 * @deprecated Import from specific files instead:
 * - FirebaseClientSingleton from './clients/FirebaseClientSingleton'
 * - Initialization functions from './services/FirebaseInitializationService'
 */

export type { FirebaseApp } from './initializers/FirebaseAppInitializer';

// Export singleton for backward compatibility
export { FirebaseClientSingleton } from './clients/FirebaseClientSingleton';
import { FirebaseClientSingleton as FCSingleton } from './clients/FirebaseClientSingleton';
export const firebaseClient = FCSingleton.getInstance();

// Re-export types and functions
export type {
  AuthInitializer,
  ServiceInitializationOptions,
  ServiceInitializationResult,
} from './services/FirebaseInitializationService';

export {
  initializeFirebase,
  getFirebaseApp,
  autoInitializeFirebase,
  initializeAllFirebaseServices,
  isFirebaseInitialized,
  getFirebaseInitializationError,
  resetFirebaseClient,
} from './services/FirebaseInitializationService';
