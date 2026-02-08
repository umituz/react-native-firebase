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
export { BaseQueryRepository } from './infrastructure/repositories/BaseQueryRepository';
export { BasePaginatedRepository } from './infrastructure/repositories/BasePaginatedRepository';

// Date Utilities
export {
  isoToTimestamp,
  timestampToISO,
  timestampToDate,
  getCurrentISOString,
} from './utils/dateUtils';

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

// Document Mapper
export {
  DocumentMapperHelper,
  createDocumentMapper,
} from './utils/document-mapper.helper';

// Path Resolver
export { FirestorePathResolver } from './utils/path-resolver';

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
  getQuotaErrorMessage,
} from './utils/quota-error-detector.util';

// Middleware
export {
  QueryDeduplicationMiddleware,
  queryDeduplicationMiddleware,
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
  createErrorResult,
  createSuccessResult,
  runTransaction,
  serverTimestamp,
} from './utils/firestore-helper';
export type { FirestoreResult, NoDbResult } from './utils/firestore-helper';

// Re-export Firestore types
export type { Timestamp } from 'firebase/firestore';
