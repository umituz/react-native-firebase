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
import { isQuotaError as checkQuotaError } from '../../../../shared/domain/utils/error-handlers/error-checkers';
import { ERROR_MESSAGES } from '../../../../shared/domain/utils/error-handlers/error-messages';
import { quotaTrackingMiddleware } from '../middleware/QuotaTrackingMiddleware';

enum RepositoryState {
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

  /**
   * Get the Firestore instance or throw error
   * @throws Error if repository is destroyed or Firestore is not initialized
   */
  protected getDbOrThrow(): Firestore {
    if (this.state === RepositoryState.DESTROYED) {
      throw new Error(ERROR_MESSAGES.REPOSITORY.DESTROYED);
    }
    const db = getFirestore();
    if (!db) {
      throw new Error(ERROR_MESSAGES.FIRESTORE.NOT_INITIALIZED);
    }
    return db;
  }

  private validateSegment(value: string, fieldName: string): void {
    if (!value || value.trim() === '') {
      throw new Error(`${fieldName} must be a non-empty string`);
    }
    if (value.includes('/')) {
      throw new Error(`${fieldName} must not contain '/' characters`);
    }
    if (value === '.' || value === '..') {
      throw new Error(`${fieldName} must not be '.' or '..'`);
    }
  }

  getUserCollection(userId: string): CollectionReference<DocumentData> | null {
    const db = this.getDb();
    if (!db) return null;
    this.validateSegment(userId, 'userId');
    return collection(db, 'users', userId, this.collectionName);
  }

  getDocRef(userId: string, documentId: string): DocumentReference<DocumentData> | null {
    const db = this.getDb();
    if (!db) return null;
    this.validateSegment(userId, 'userId');
    this.validateSegment(documentId, 'documentId');
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
   * Track read operation for quota monitoring
   *
   * @param collection - Collection name
   * @param count - Number of documents read
   * @param cached - Whether the result is from cache
   */
  protected trackRead(
    collection: string,
    count: number = 1,
    cached: boolean = false,
  ): void {
    quotaTrackingMiddleware.trackRead(collection, count, cached);
  }

  /**
   * Track write operation for quota monitoring
   *
   * @param collection - Collection name
   * @param count - Number of documents written
   */
  protected trackWrite(
    collection: string,
    count: number = 1,
  ): void {
    quotaTrackingMiddleware.trackWrite(collection, count);
  }

  /**
   * Track delete operation for quota monitoring
   *
   * @param collection - Collection name
   * @param count - Number of documents deleted
   */
  protected trackDelete(
    collection: string,
    count: number = 1,
  ): void {
    quotaTrackingMiddleware.trackDelete(collection, count);
  }

  /**
   * Destroy the repository
   * Prevents further operations
   */
  destroy(): void {
    this.state = RepositoryState.DESTROYED;
  }
}
