/**
 * Collection Entity (Main)
 * Single Responsibility: Represent a Firestore collection with metadata
 *
 * Domain entity that encapsulates collection information and metadata.
 * Provides business logic for collection operations.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { CollectionReference, Query } from 'firebase/firestore';
import {
  isValidCollectionName,
  isValidCollectionPath,
  extractCollectionNameFromPath,
  extractParentCollectionPath,
  isUserCollectionPath,
  extractUserIdFromPath,
  createSubCollectionPath as createSubCollectionPathUtil,
} from './CollectionValidation';
import {
  getCollectionDepth,
  collectionToObject,
  isQueryReference,
  isCollectionReference as isCollectionReferenceUtil,
} from './CollectionUtils';
import { fromReference, fromQuery } from './CollectionFactory';

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
    return fromReference(reference);
  }

  /**
   * Create collection from query
   */
  static fromQuery<TDocument = unknown>(query: Query<TDocument>, name: string, path: string): Collection<TDocument> {
    return fromQuery(query, name, path);
  }

  getName(): string {
    return this.name;
  }

  getPath(): string {
    return this.path;
  }

  getParentPath(): string | undefined {
    return this.parentPath;
  }

  isNested(): boolean {
    return this.parentPath !== undefined;
  }

  isRootLevel(): boolean {
    return this.parentPath === undefined;
  }

  getDepth(): number {
    return getCollectionDepth(this);
  }

  getReference(): CollectionReference<TDocument> | Query<TDocument> {
    return this.reference;
  }

  isQuery(): boolean {
    return isQueryReference(this.reference);
  }

  isCollectionReference(): boolean {
    return isCollectionReferenceUtil(this.reference);
  }

  toObject(): CollectionMetadata {
    return collectionToObject(this);
  }

  createSubCollectionPath(subCollectionName: string): string | null {
    return createSubCollectionPathUtil(this.path, subCollectionName);
  }

  isUserCollection(): boolean {
    return isUserCollectionPath(this.path);
  }

  extractUserId(): string | null {
    return extractUserIdFromPath(this.path);
  }
}

