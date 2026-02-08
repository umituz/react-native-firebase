/**
 * Base Repository - Core Operations
 *
 * Provides essential Firestore operations with centralized database access.
 * All Firestore repositories should extend this class.
 *
 * Architecture:
 * - DRY: Centralized database access (getDb)
 * - SOLID: Single Responsibility - Database access only
 * - KISS: Simple base class with protected db property
 * - App-agnostic: Works with any app, no app-specific code
 *
 * This class is designed to be used across hundreds of apps.
 * It provides a consistent interface for Firestore operations.
 */

import type { Firestore } from "firebase/firestore";
import { getFirestore } from "../config/FirestoreClient";
import {
  isQuotaError as checkQuotaError,
  getQuotaErrorMessage,
} from "../../utils/quota-error-detector.util";
import { FirebaseFirestoreQuotaError } from "../../domain/errors/FirebaseFirestoreError";

export class BaseRepository {
  private isDestroyed = false;

  /**
   * Get Firestore database instance
   * Returns null if Firestore is not initialized (offline mode)
   * Use getDbOrThrow() if you need to throw an error instead
   *
   * @returns Firestore instance or null if not initialized
   */
  protected getDb(): Firestore | null {
    if (this.isDestroyed) {
      if (__DEV__) {
        console.warn('[BaseRepository] Attempted to use destroyed repository');
      }
      return null;
    }
    return getFirestore();
  }

  /**
   * Get Firestore database instance or throw error
   * Throws error if Firestore is not initialized
   * Use this method when Firestore is required for the operation
   *
   * @returns Firestore instance
   * @throws Error if Firestore is not initialized
   */
  protected getDbOrThrow(): Firestore {
    if (this.isDestroyed) {
      throw new Error("Repository has been destroyed");
    }
    const db = getFirestore();
    if (!db) {
      throw new Error("Firestore is not initialized. Please initialize Firebase App first.");
    }
    return db;
  }

  /**
   * Check if Firestore is initialized
   * Useful for conditional operations
   *
   * @returns true if Firestore is initialized, false otherwise
   */
  protected isDbInitialized(): boolean {
    try {
      const db = getFirestore();
      return db !== null;
    } catch (error) {
      if (__DEV__) console.warn('[BaseRepository] isDbInitialized check failed:', error);
      return false;
    }
  }

  /**
   * Check if error is a quota error
   * Quota errors indicate daily read/write/delete limits are exceeded
   *
   * @param error - Error to check
   * @returns true if error is a quota error
   */
  protected isQuotaError(error: unknown): boolean {
    return checkQuotaError(error);
  }

  /**
   * Handle quota error
   * Throws FirebaseFirestoreQuotaError with user-friendly message
   *
   * @param error - Original error
   * @throws FirebaseFirestoreQuotaError
   */
  protected handleQuotaError(error: unknown): never {
    const message = getQuotaErrorMessage();
    throw new FirebaseFirestoreQuotaError(message, error);
  }

  /**
   * Wrap Firestore operation with quota error handling
   * Automatically detects and handles quota errors
   *
   * @param operation - Firestore operation to execute
   * @returns Result of the operation
   * @throws FirebaseFirestoreQuotaError if quota error occurs
   */
  protected async executeWithQuotaHandling<T>(
    operation: () => Promise<T>,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (this.isQuotaError(error)) {
        this.handleQuotaError(error);
      }
      // Log the error for debugging
      if (__DEV__) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('[BaseRepository] Operation failed:', errorMessage);
      }
      throw error;
    }
  }

  /**
   * Destroy repository and cleanup resources
   * Child classes can override onDestroy() to add custom cleanup logic
   */
  destroy(): void {
    if (__DEV__) {
      console.log(`[BaseRepository] Destroying repository for ${this.constructor.name}`);
    }

    // Call child class cleanup if implemented
    this.onDestroy();

    // Mark as destroyed
    this.isDestroyed = true;
  }

  /**
   * Cleanup hook for child classes
   * Override this method to add custom cleanup logic (e.g., unsubscribe from listeners)
   */
  protected onDestroy(): void {
    // Override in child classes if needed
  }
}