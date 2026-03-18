/**
 * Collection Entity
 * Single Responsibility: Represent a Firestore collection with metadata
 *
 * Domain entity that encapsulates collection information and metadata.
 * Provides business logic for collection operations.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { CollectionReference, Query } from 'firebase/firestore';
import type { Document } from './Document';

/**
 * Collection metadata
 */
export interface CollectionMetadata {
  readonly name: string;
  readonly path: string;
  readonly parentPath?: string;
}

/**
 * Collection entity
 * Represents a Firestore collection with metadata
 */
export class Collection<TDocument = unknown> {
  readonly name: string;
  readonly path: string;
  readonly parentPath: string | undefined;
  private readonly reference: CollectionReference<TDocument> | Query<TDocument>;

  constructor(
    reference: CollectionReference<TDocument> | Query<TDocument>,
    metadata: CollectionMetadata
  ) {
    this.reference = reference;
    this.name = metadata.name;
    this.path = metadata.path;
    this.parentPath = metadata.parentPath || undefined;
  }

  /**
   * Create collection from collection reference
   */
  static fromReference<TDocument = unknown>(
    reference: CollectionReference<TDocument>
  ): Collection<TDocument> {
    return new Collection(reference, {
      name: reference.id,
      path: reference.path,
      parentPath: reference.parent?.path || null,
    });
  }

  /**
   * Create collection from query
   */
  static fromQuery<TDocument = unknown>(query: Query<TDocument>, name: string, path: string): Collection<TDocument> {
    return new Collection(query, {
      name,
      path,
      parentPath: path.split('/').slice(0, -2).join('/') || null,
    });
  }

  /**
   * Get collection name
   */
  getName(): string {
    return this.name;
  }

  /**
   * Get collection path
   */
  getPath(): string {
    return this.path;
  }

  /**
   * Get parent path if exists
   */
  getParentPath(): string | null {
    return this.parentPath;
  }

  /**
   * Check if collection is nested (has parent)
   */
  isNested(): boolean {
    return this.parentPath !== null;
  }

  /**
   * Check if collection is root level (no parent)
   */
  isRootLevel(): boolean {
    return this.parentPath === null;
  }

  /**
   * Get collection depth in hierarchy
   * Root collections have depth 0
   */
  getDepth(): number {
    if (!this.parentPath) return 0;
    return this.path.split('/').length / 2 - 1;
  }

  /**
   * Get the underlying reference
   */
  getReference(): CollectionReference<TDocument> | Query<TDocument> {
    return this.reference;
  }

  /**
   * Check if collection is a query (has filters/limits)
   */
  isQuery(): boolean {
    return 'type' in this.reference && this.reference.type === 'query';
  }

  /**
   * Check if collection is a collection reference (no filters)
   */
  isCollectionReference(): boolean {
    return !this.isQuery();
  }

  /**
   * Validate collection name format
   * Collection names must match Firestore requirements
   */
  static isValidName(name: string): boolean {
    // Collection names must be non-empty strings
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return false;
    }

    // Cannot contain special characters
    const invalidChars = /[\/\\.\s]/;
    if (invalidChars.test(name)) {
      return false;
    }

    // Cannot start or end with double underscore
    if (name.startsWith('__') || name.endsWith('__')) {
      return false;
    }

    // Reasonable length limit
    if (name.length > 100) {
      return false;
    }

    return true;
  }

  /**
   * Validate collection path format
   * Paths must follow Firestore path structure
   */
  static isValidPath(path: string): boolean {
    if (!path || typeof path !== 'string' || path.trim() === '') {
      return false;
    }

    const segments = path.split('/');
    if (segments.length < 2 || segments.length % 2 !== 0) {
      return false;
    }

    return segments.every(segment => this.isValidName(segment));
  }

  /**
   * Extract collection name from path
   */
  static extractNameFromPath(path: string): string | null {
    if (!this.isValidPath(path)) {
      return null;
    }

    const segments = path.split('/');
    return segments[segments.length - 1] || null;
  }

  /**
   * Extract parent path from collection path
   */
  static extractParentPath(path: string): string | null {
    if (!this.isValidPath(path)) {
      return null;
    }

    const segments = path.split('/');
    if (segments.length <= 2) {
      return null;
    }

    return segments.slice(0, -1).join('/');
  }

  /**
   * Convert to plain object (for serialization)
   */
  toObject(): CollectionMetadata {
    return {
      name: this.name,
      path: this.path,
      parentPath: this.parentPath || undefined,
    };
  }

  /**
   * Create a sub-collection path
   */
  createSubCollectionPath(subCollectionName: string): string | null {
    if (!Collection.isValidName(subCollectionName)) {
      return null;
    }

    return `${this.path}/${subCollectionName}`;
  }

  /**
   * Check if collection is a sub-collection of another
   */
  isSubCollectionOf(other: Collection): boolean {
    return this.parentPath === other.path;
  }

  /**
   * Check if collection is parent of another
   */
  isParentOf(other: Collection): boolean {
    return other.isSubCollectionOf(this);
  }

  /**
   * Get collection ID (similar to name but more explicit)
   */
  getId(): string {
    return this.name;
  }

  /**
   * Check if this is a user collection (users/{userId}/{collection})
   */
  isUserCollection(): boolean {
    return this.parentPath?.startsWith('users/') || false;
  }

  /**
   * Extract user ID from user collection path
   * Returns null if not a user collection
   */
  extractUserId(): string | null {
    if (!this.isUserCollection()) return null;

    const segments = this.path.split('/');
    if (segments.length >= 3 && segments[0] === 'users') {
      return segments[1];
    }

    return null;
  }
}

/**
 * Factory function to create collection entity
 */
export function createCollection<TDocument = unknown>(
  reference: CollectionReference<TDocument> | Query<TDocument>,
  name?: string,
  path?: string
): Collection<TDocument> {
  if ('type' in reference && reference.type === 'query') {
    if (!name || !path) {
      throw new Error('name and path are required for query collections');
    }
    return Collection.fromQuery(reference, name, path);
  }

  return Collection.fromReference(reference as CollectionReference<TDocument>);
}
