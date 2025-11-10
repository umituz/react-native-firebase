/**
 * Firebase Client Port (Interface)
 *
 * Domain-Driven Design: Application layer port for Firebase client
 * Defines the contract for Firebase client operations
 */

import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

/**
 * Firebase Client Interface
 * Defines the contract for Firebase client operations
 */
export interface IFirebaseClient {
  /**
   * Get the Firebase app instance
   * @throws {FirebaseInitializationError} If client is not initialized
   */
  getApp(): FirebaseApp;

  /**
   * Get the Firebase Auth instance
   * @throws {FirebaseInitializationError} If client is not initialized
   */
  getAuth(): Auth;

  /**
   * Get the Firestore instance
   * @throws {FirebaseInitializationError} If client is not initialized
   */
  getFirestore(): Firestore;

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


