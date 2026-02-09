/**
 * Base Repository - Core Firestore Operations
 *
 * Provides base functionality for all Firestore repositories.
 * Handles initialization checks, error handling, and quota tracking.
 */

import type { Firestore } from 'firebase/firestore';
import { getFirestore } from 'firebase/firestore';
import { isQuotaError as checkQuotaError } from '../../utils/quota-error-detector.util';

/**
 * Repository destruction state
 */
export enum RepositoryState {
  ACTIVE = 'active',
  DESTROYED = 'destroyed',
}

/**
 * Base repository for Firestore operations
 * Provides common functionality for all repositories
 */
export abstract class BaseRepository {
  protected state: RepositoryState = RepositoryState.ACTIVE;

  /**
   * Get the Firestore instance
   * @throws Error if repository is destroyed
   */
  protected getDb(): Firestore | null {
    if (this.state === RepositoryState.DESTROYED) {
      return null;
    }
    return getFirestore();
  }

  /**
   * Check if Firestore is initialized
   */
  protected isDbInitialized(): boolean {
    try {
      const db = this.getDb();
      return db !== null;
    } catch {
      return false;
    }
  }

  /**
   * Execute operation with error handling
   * @param collection - Collection name for tracking
   * @param operation - Operation to execute
   * @returns Operation result
   * @throws Error if operation fails
   */
  protected async executeOperation<T>(
    collection: string,
    operation: () => Promise<T>
  ): Promise<T> {
    if (this.state === RepositoryState.DESTROYED) {
      throw new Error('Repository has been destroyed');
    }

    try {
      return await operation();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      // Check if this is a quota error
      if (checkQuotaError(error)) {
        throw new Error(`Firestore quota exceeded: ${errorMessage}`);
      }

      throw error;
    }
  }

  /**
   * Track read operation
   */
  protected trackRead(_collection: string, _count: number = 1): void {
    // Quota tracking delegated to middleware
  }

  /**
   * Track write operation
   */
  protected trackWrite(_collection: string, _count: number = 1): void {
    // Quota tracking delegated to middleware
  }

  /**
   * Track delete operation
   */
  protected trackDelete(_collection: string, _count: number = 1): void {
    // Quota tracking delegated to middleware
  }

  /**
   * Destroy the repository
   * Prevents further operations
   */
  destroy(): void {
    this.state = RepositoryState.DESTROYED;
  }
}
