/**
 * Firestore Domain Layer
 * Domain-Driven Design (DDD) - Domain Exports
 *
 * Pure domain logic without infrastructure concerns.
 * Exports entities, value objects, and domain services.
 */

// Domain Errors
export {
  FirebaseFirestoreError,
  FirebaseFirestoreInitializationError,
  FirebaseFirestoreQuotaError,
} from './errors/FirebaseFirestoreError';

// Domain Entities
export { Collection, createCollection, fromReference, fromQuery } from './entities/Collection';
export type { CollectionMetadata } from './entities/Collection';

// Collection Entity Helpers
export {
  isParentOf,
  getCollectionId,
  collectionsEqual,
  getCollectionInfo,
  collectionFromPath,
  getSubCollectionNames,
  buildCollectionPath,
  parseCollectionPath,
} from './entities/CollectionHelpers';

// Collection Utilities
export {
  getCollectionDepth,
  collectionToObject,
  isQueryReference,
} from './entities/CollectionUtils';

// Collection Validation
export {
  isValidCollectionName,
  isValidCollectionPath,
  isValidCollection,
  extractCollectionNameFromPath,
  extractParentCollectionPath,
  isDocumentPath,
  isCollectionPath,
  isUserCollectionPath,
  extractUserIdFromPath,
  createSubCollectionPath,
} from './entities/CollectionValidation';

// Domain Value Objects
export { QueryOptions, createQueryOptions } from './value-objects/QueryOptions';
export { WhereClause, equals, where, create as createWhereClause } from './value-objects/WhereClause';
export type { SortOptions, DateRangeOptions, PaginationOptions } from './value-objects/QueryOptions';
export type { WhereOperator } from './value-objects/WhereClause';
