/**
 * Collection Factory
 * Single Responsibility: Create collection entities
 *
 * Max lines: 150 (enforced for maintainability)
 */

import type { CollectionReference, Query } from 'firebase/firestore';
import { Collection } from './Collection';

/**
 * Create collection from collection reference
 */
export function fromReference<TDocument = unknown>(
  reference: CollectionReference<TDocument>
): Collection<TDocument> {
  return new Collection(reference, {
    name: reference.id,
    path: reference.path,
    parentPath: reference.parent?.path || undefined,
  });
}

/**
 * Create collection from query
 */
export function fromQuery<TDocument = unknown>(
  query: Query<TDocument>,
  name: string,
  path: string
): Collection<TDocument> {
  return new Collection(query, {
    name,
    path,
    parentPath: path.split('/').slice(0, -2).join('/') || undefined,
  });
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
    return fromQuery(reference, name, path);
  }

  return fromReference(reference as CollectionReference<TDocument>);
}
