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
import { ERROR_MESSAGES } from '../../../../shared/domain/utils/error-handlers/error-messages';

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
   * @note State check is handled by getDb() - all Firestore operations must go through getDb()
   */
  protected async executeOperation<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (checkQuotaError(error)) {
        throw new Error(ERROR_MESSAGES.FIRESTORE.QUOTA_EXCEEDED);
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
