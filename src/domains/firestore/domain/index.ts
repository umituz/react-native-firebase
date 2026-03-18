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
export { Document, createDocument } from './entities/Document';
export { Collection, createCollection } from './entities/Collection';
export type { DocumentMetadata } from './entities/Document';
export type { CollectionMetadata } from './entities/Collection';

// Domain Value Objects
export { QueryOptions, createQueryOptions } from './value-objects/QueryOptions';
export { WhereClause, createWhereClause, where } from './value-objects/WhereClause';
export type { SortOptions, DateRangeOptions, PaginationOptions } from './value-objects/QueryOptions';
export type { WhereOperator } from './value-objects/WhereClause';

// Domain Services
export { QueryService, createQueryService } from './services/QueryService';
export type { QueryBuilderResult } from './services/QueryService';
