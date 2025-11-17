/**
 * Firebase Client Port (Interface)
 *
 * Domain-Driven Design: Application layer port for Firebase client
 * Defines the contract for Firebase client operations
 */

import type { FirebaseApp } from 'firebase/app';

/**
 * Firebase Client Interface
 * Defines the contract for Firebase client operations
 * 
 * Note: 
 * - Firebase Auth is now handled by @umituz/react-native-firebase-auth
 * - Firestore is now handled by @umituz/react-native-firestore
 */
export interface IFirebaseClient {
  /**
   * Get the Firebase app instance
   * @throws {FirebaseInitializationError} If client is not initialized
   */
  getApp(): FirebaseApp;

  /**
   * Check if client is initialized
   */
  isInitialized(): boolean;

  /**
   * Get initialization error if any
   */
  getInitializationError(): string | null;

  /**
   * Reset the client instance
   * Useful for testing
   */
  reset(): void;
}





