/**
 * React Native Firestore Module
 * Domain-Driven Design (DDD) Architecture
 */

// =============================================================================
// DOMAIN LAYER - Business Logic
// =============================================================================

export * from './domain';

// =============================================================================
// INFRASTRUCTURE LAYER - Implementation
// =============================================================================

// Firestore Client
export {
  initializeFirestore,
  getFirestore,
  isFirestoreInitialized,
  getFirestoreInitializationError,
  resetFirestoreClient,
} from './infrastructure/config/FirestoreClient';
export type { Firestore } from './infrastructure/config/FirestoreClient';

// Repositories
export { BaseRepository } from './infrastructure/repositories/BaseRepository';
export type { IPathResolver } from './infrastructure/repositories/BaseRepository';
export { BaseQueryRepository } from './infrastructure/repositories/BaseQueryRepository';
export { BasePaginatedRepository } from './infrastructure/repositories/BasePaginatedRepository';

// Date Utilities
export {
  isoToTimestamp,
  timestampToISO,
  timestampToDate,
  getCurrentISOString,
  formatRelativeTime,
} from './utils/dateUtils';
export type { RelativeTimeLabels } from './utils/dateUtils';

// Query Builder
export {
  buildQuery,
  createInFilter,
  createEqualFilter,
} from './utils/query-builder';
export type {
  QueryBuilderOptions,
  FieldFilter,
} from './utils/query-builder';

// Pagination
export {
  PaginationHelper,
  createPaginationHelper,
} from './utils/pagination.helper';
export type {
  PaginatedResult,
  PaginationParams,
} from './types/pagination.types';
export { EMPTY_PAGINATED_RESULT } from './types/pagination.types';

// Firestore Helper Utilities
export {
  withFirestore,
  withFirestoreVoid,
  withFirestoreBool,
} from './utils/operation/operation-executor.util';

export {
  runTransaction,
  serverTimestamp,
} from './utils/transaction/transaction.util';

export {
  createErrorResult,
  createSuccessResult,
} from './utils/result/result.util';
export type { NoDbResult } from './utils/result/result.util';

// Validation Utilities
export {
  isValidCursor,
  validateCursorOrThrow,
  CursorValidationError,
} from './utils/validation/cursor-validator.util';
export {
  isValidFieldName,
} from './utils/validation/field-validator.util';
export {
  isValidDateRange,
  validateDateRangeOrThrow,
} from './utils/validation/date-validator.util';

// Presentation — TanStack Query integration
export { useFirestoreQuery } from './presentation/hooks/useFirestoreQuery';
export { useFirestoreMutation } from './presentation/hooks/useFirestoreMutation';
export { useFirestoreSnapshot } from './presentation/hooks/useFirestoreSnapshot';

export type { UseFirestoreQueryOptions } from './presentation/hooks/useFirestoreQuery';
export type { UseFirestoreMutationOptions } from './presentation/hooks/useFirestoreMutation';
export type { UseFirestoreSnapshotOptions } from './presentation/hooks/useFirestoreSnapshot';

// Export Firestore types directly from firebase package
// Import them in your app: import { Timestamp } from 'firebase/firestore';

