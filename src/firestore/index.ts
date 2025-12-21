/**
 * React Native Firestore Module
 * Domain-Driven Design (DDD) Architecture
 *
 * This is the SINGLE SOURCE OF TRUTH for all Firestore operations.
 * ALL imports from the Firestore module MUST go through this file.
 *
 * Architecture:
 * - domain: Errors, Constants, Entities, Services
 * - infrastructure: Firestore client, BaseRepository, utilities
 * - utils: Date utilities, timestamp conversion, query builders
 *
 * This module is designed to be used across hundreds of apps.
 * It provides a consistent interface for Firestore operations.
 */

// =============================================================================
// DOMAIN LAYER - Errors
// =============================================================================

export {
  FirebaseFirestoreError,
  FirebaseFirestoreInitializationError,
  FirebaseFirestoreQuotaError,
} from './domain/errors/FirebaseFirestoreError';

// =============================================================================
// INFRASTRUCTURE LAYER - Firestore Client
// =============================================================================

export {
  initializeFirestore,
  getFirestore,
  isFirestoreInitialized,
  getFirestoreInitializationError,
  resetFirestoreClient,
  firestoreClient,
} from './infrastructure/config/FirestoreClient';

export type { Firestore } from './infrastructure/config/FirestoreClient';

// =============================================================================
// INFRASTRUCTURE LAYER - BaseRepository
// =============================================================================

export { BaseRepository } from './infrastructure/repositories/BaseRepository';
export { BaseQueryRepository } from './infrastructure/repositories/BaseQueryRepository';
export { BasePaginatedRepository } from './infrastructure/repositories/BasePaginatedRepository';

// =============================================================================
// UTILS - Date Utilities
// =============================================================================

export {
  isoToTimestamp,
  timestampToISO,
  timestampToDate,
  getCurrentISOString,
} from './utils/dateUtils';

// =============================================================================
// UTILS - Query Builder
// =============================================================================

export {
  buildQuery,
  createInFilter,
  createEqualFilter,
} from './utils/query-builder';

export type {
  QueryBuilderOptions,
  FieldFilter,
} from './utils/query-builder';

// =============================================================================
// UTILS - Pagination
// =============================================================================

export {
  PaginationHelper,
  createPaginationHelper,
} from './utils/pagination.helper';

export type {
  PaginatedResult,
  PaginationParams,
} from './types/pagination.types';

export { EMPTY_PAGINATED_RESULT } from './types/pagination.types';

// =============================================================================
// UTILS - Document Mapper
// =============================================================================

export {
  DocumentMapperHelper,
  createDocumentMapper,
} from './utils/document-mapper.helper';

// =============================================================================
// UTILS - Quota Error Detection
// =============================================================================

export {
  isQuotaError,
  isRetryableError,
  getQuotaErrorMessage,
} from './utils/quota-error-detector.util';

// =============================================================================
// DOMAIN LAYER - Constants
// =============================================================================

export {
  FREE_TIER_LIMITS,
  QUOTA_THRESHOLDS,
  calculateQuotaUsage,
  isQuotaThresholdReached,
  getRemainingQuota,
} from './domain/constants/QuotaLimits';

// =============================================================================
// DOMAIN LAYER - Entities
// =============================================================================

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

// =============================================================================
// DOMAIN LAYER - Services
// =============================================================================

export { QuotaCalculator } from './domain/services/QuotaCalculator';

// =============================================================================
// INFRASTRUCTURE LAYER - Middleware
// =============================================================================

export {
  QueryDeduplicationMiddleware,
  queryDeduplicationMiddleware,
} from './infrastructure/middleware/QueryDeduplicationMiddleware';

export {
  QuotaTrackingMiddleware,
  quotaTrackingMiddleware,
} from './infrastructure/middleware/QuotaTrackingMiddleware';

// =============================================================================
// INFRASTRUCTURE LAYER - Services
// =============================================================================

export {
  QuotaMonitorService,
  quotaMonitorService,
} from './infrastructure/services/QuotaMonitorService';

export {
  RequestLoggerService,
  requestLoggerService,
} from './infrastructure/services/RequestLoggerService';

// Re-export Firestore types for convenience
export type { Timestamp } from 'firebase/firestore';
