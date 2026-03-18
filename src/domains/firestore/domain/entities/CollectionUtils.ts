/**
 * Collection Utilities
 * Single Responsibility: Provide utility functions for collection operations
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { CollectionReference, Query } from 'firebase/firestore';
import type { Collection, CollectionMetadata } from './Collection';

/**
 * Get collection depth in hierarchy
 * Root collections have depth 0
 */
export function getCollectionDepth(collection: Collection): number {
  if (!collection.getParentPath()) return 0;
  const path = collection.getPath();
  return path.split('/').length / 2 - 1;
}

/**
 * Convert collection to plain object (for serialization)
 */
export function collectionToObject(collection: Collection): CollectionMetadata {
  return {
    name: collection.getName(),
    path: collection.getPath(),
    parentPath: collection.getParentPath(),
  };
}

/**
 * Check if reference is a query (has filters/limits)
 */
export function isQueryReference<TDocument>(
  reference: CollectionReference<TDocument> | Query<TDocument>
): boolean {
  return 'type' in reference && reference.type === 'query';
}

/**
 * Check if reference is a collection reference (no filters)
 */
export function isCollectionReference<TDocument>(
  reference: CollectionReference<TDocument> | Query<TDocument>
): boolean {
  return !isQueryReference(reference);
}

/**
 * Get collection size info (metadata)
 */
export function getCollectionInfo(collection: Collection): {
  readonly name: string;
  readonly path: string;
  readonly depth: number;
  readonly isNested: boolean;
  readonly isRoot: boolean;
  readonly isUserCollection: boolean;
  readonly isQuery: boolean;
} {
  const reference = collection.getReference();
  return {
    name: collection.getName(),
    path: collection.getPath(),
    depth: getCollectionDepth(collection),
    isNested: collection.isNested(),
    isRoot: collection.isRootLevel(),
    isUserCollection: collection.isUserCollection(),
    isQuery: isQueryReference(reference),
  };
}
