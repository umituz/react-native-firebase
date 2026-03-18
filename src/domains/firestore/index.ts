/**
 * React Native Firestore Module
 * Domain-Driven Design (DDD) Architecture
 */

// Domain Errors
export {
  FirebaseFirestoreError,
  FirebaseFirestoreInitializationError,
  FirebaseFirestoreQuotaError,
} from './domain/errors/FirebaseFirestoreError';

// Firestore Client
export {
  initializeFirestore,
  getFirestore,
  isFirestoreInitialized,
  getFirestoreInitializationError,
  resetFirestoreClient,
  firestoreClient,
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

// Domain Constants
export {
  FREE_TIER_LIMITS,
  QUOTA_THRESHOLDS,
  calculateQuotaUsage,
  isQuotaThresholdReached,
  getRemainingQuota,
} from './domain/constants/QuotaLimits';

// Domain Entities
export type {
  QuotaMetrics,
  QuotaLimits,
  QuotaStatus,
} from './domain/entities/QuotaMetrics';
export type {
  RequestLog,
  RequestStats,
  RequestType,
} from './domain/entities/RequestLog';

// Domain Services
export { QuotaCalculator } from './domain/services/QuotaCalculator';

// Quota Error Detection
export {
  isQuotaError,
  isRetryableError,
} from '../../shared/domain/utils/error-handlers/error-checkers';
export {
  getQuotaErrorMessage,
} from '../../shared/domain/utils/error-handlers/error-messages';

// Middleware
export {
  QueryDeduplicationMiddleware,
  queryDeduplicationMiddleware,
  syncDeduplicationWithQuota,
  useDeduplicationWithQuota,
} from './infrastructure/middleware/QueryDeduplicationMiddleware';
export type {
  QueryDeduplicationConfig,
  DeduplicationStatistics,
} from './infrastructure/middleware/QueryDeduplicationMiddleware';
export {
  QuotaTrackingMiddleware,
  quotaTrackingMiddleware,
} from './infrastructure/middleware/QuotaTrackingMiddleware';

// Services
export {
  RequestLoggerService,
  requestLoggerService,
} from './infrastructure/services/RequestLoggerService';

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
export { useSmartFirestoreSnapshot, useSmartListenerControl } from './presentation/hooks/useSmartFirestoreSnapshot';
export { createFirestoreKeys } from './presentation/query-keys/createFirestoreKeys';

export type { UseFirestoreQueryOptions } from './presentation/hooks/useFirestoreQuery';
export type { UseFirestoreMutationOptions } from './presentation/hooks/useFirestoreMutation';
export type { UseFirestoreSnapshotOptions } from './presentation/hooks/useFirestoreSnapshot';
export type { UseSmartFirestoreSnapshotOptions, BackgroundStrategy } from './presentation/hooks/useSmartFirestoreSnapshot';

export { Timestamp } from 'firebase/firestore';
export type {
  CollectionReference,
  QueryDocumentSnapshot,
  DocumentData,
  Transaction,
  DocumentReference,
  WriteBatch,
  DocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
