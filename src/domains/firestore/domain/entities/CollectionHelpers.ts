/**
 * Collection Entity Helpers
 * Single Responsibility: Provide utility methods for collections
 *
 * Helper methods separated from main Collection entity.
 *
 * Max lines: 150 (enforced for maintainability)
 */

import { Collection } from './Collection';
import { isValidCollectionPath, isValidCollectionName } from './CollectionValidation';

/**
 * Check if collection is parent of another
 */
export function isParentOf(parent: Collection, child: Collection): boolean {
  const childPath = child.getPath();
  const parentPath = parent.getPath();
  return childPath.startsWith(parentPath + '/');
}

/**
 * Get collection ID (similar to name but more explicit)
 */
export function getCollectionId(collection: Collection): string {
  return collection.getName();
}

/**
 * Check if collections are equal
 */
export function collectionsEqual(col1: Collection, col2: Collection): boolean {
  return col1.getPath() === col2.getPath();
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
} {
  return {
    name: collection.getName(),
    path: collection.getPath(),
    depth: collection.getDepth(),
    isNested: collection.isNested(),
    isRoot: collection.isRootLevel(),
    isUserCollection: collection.isUserCollection(),
  };
}

export function isValidCollection(collection: Collection): boolean {
  return isValidCollectionName(collection.getName()) &&
         isValidCollectionPath(collection.getPath());
}

export function collectionFromPath(db: any, path: string): Collection | null {
  if (!isValidCollectionPath(path)) {
    return null;
  }

  try {
    const ref = db.collection(path);
    return Collection.fromReference(ref as any);
  } catch {
    return null;
  }
}

export function getSubCollectionNames(path: string): string[] {
  if (!isValidCollectionPath(path)) {
    return [];
  }

  const segments = path.split('/');
  const collections: string[] = [];

  // Extract collection names (even indices)
  for (let i = 0; i < segments.length; i += 2) {
    const segment = segments[i];
    if (segment) {
      collections.push(segment);
    }
  }

  return collections;
}

export function buildCollectionPath(...parts: string[]): string {
  if (parts.length === 0 || parts.length % 2 !== 0) {
    throw new Error('Invalid collection path parts');
  }

  if (!parts.every(p => isValidCollectionName(p))) {
    throw new Error('Invalid collection name in parts');
  }

  return parts.join('/');
}

export function parseCollectionPath(path: string): {
  readonly collections: string[];
  readonly documents: string[];
  readonly segments: string[];
} | null {
  if (!isValidCollectionPath(path)) {
    return null;
  }

  const segments = path.split('/');
  const collections: string[] = [];
  const documents: string[] = [];

  for (let i = 0; i < segments.length; i += 2) {
    const collectionSegment = segments[i];
    if (collectionSegment) {
      collections.push(collectionSegment);
    }
    if (i + 1 < segments.length) {
      const documentSegment = segments[i + 1];
      if (documentSegment) {
        documents.push(documentSegment);
      }
    }
  }

  return { collections, documents, segments };
}

export function isDocumentPath(path: string): boolean {
  const segments = path.split('/');
  return segments.length % 2 === 0 && segments.length >= 2;
}

export function isCollectionPath(path: string): boolean {
  const segments = path.split('/');
  return segments.length % 2 !== 0 && segments.length >= 1;
}
