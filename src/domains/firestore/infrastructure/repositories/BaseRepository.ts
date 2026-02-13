/**
 * Base Repository - Core Firestore Operations
 *
 * Provides base functionality for all Firestore repositories.
 * Standard pattern: users/{userId}/{collectionName}
 *
 * Subclasses must provide collectionName via constructor.
 * This class handles all path resolution, eliminating need for FirestorePathResolver.
 */

import type { Firestore, CollectionReference, DocumentReference, DocumentData } from 'firebase/firestore';
import { getFirestore, collection, doc } from 'firebase/firestore';
import { isQuotaError as checkQuotaError } from '../../utils/quota-error-detector.util';

export enum RepositoryState {
  ACTIVE = 'active',
  DESTROYED = 'destroyed',
}

export interface IPathResolver {
  getUserCollection(userId: string): CollectionReference<DocumentData> | null;
  getDocRef(userId: string, documentId: string): DocumentReference<DocumentData> | null;
}

export abstract class BaseRepository implements IPathResolver {
  protected state: RepositoryState = RepositoryState.ACTIVE;
  protected readonly collectionName: string;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
  }

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

  getUserCollection(userId: string): CollectionReference<DocumentData> | null {
    const db = this.getDb();
    if (!db) return null;
    return collection(db, 'users', userId, this.collectionName);
  }

  getDocRef(userId: string, documentId: string): DocumentReference<DocumentData> | null {
    const db = this.getDb();
    if (!db) return null;
    return doc(db, 'users', userId, this.collectionName, documentId);
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
   * @param operation - Operation to execute
   * @returns Operation result
   * @throws Error if operation fails
   */
  protected async executeOperation<T>(
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
   * Destroy the repository
   * Prevents further operations
   */
  destroy(): void {
    this.state = RepositoryState.DESTROYED;
  }
}
