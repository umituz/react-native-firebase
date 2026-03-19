/**
 * React Native Firebase - Unified Package
 *
 * Domain-Driven Design (DDD) Architecture
 */

// Core Errors
export {
  FirebaseError,
  FirebaseInitializationError,
  FirebaseConfigurationError,
} from "./shared/domain/errors/FirebaseError";

// Core Types
export type { FirebaseConfig } from "./shared/domain/value-objects/FirebaseConfig";
export type { IFirebaseClient } from "./application/ports/IFirebaseClient";

// Core Client
export {
  initializeFirebase,
  getFirebaseApp,
  autoInitializeFirebase,
  initializeAllFirebaseServices,
  isFirebaseInitialized,
  getFirebaseInitializationError,
  resetFirebaseClient,
} from "./shared/infrastructure/config/services/FirebaseInitializationService";

export type {
  AuthInitializer,
  ServiceInitializationOptions,
  ServiceInitializationResult,
} from "./shared/infrastructure/config/services/FirebaseInitializationService";

export type { FirebaseApp } from "./shared/infrastructure/config/initializers/FirebaseAppInitializer";

// Type Guards
export {
  isFirestoreError,
  isAuthError,
  isNetworkError,
  isPermissionDeniedError,
  isNotFoundError,
  isQuotaExceededError,
  getSafeErrorMessage,
  getSafeErrorCode,
} from "./shared/domain/guards/firebase-error.guard";

// =============================================================================
// AUTH DOMAIN EXPORTS
// =============================================================================

// Domain Layer
export type { FirebaseAuthConfig } from './domains/auth/domain/value-objects/FirebaseAuthConfig';
export {
  isAnonymousUser,
} from './domains/auth/domain/entities/AnonymousUser';
export type { AnonymousUser } from './domains/auth/domain/entities/AnonymousUser';

// Infrastructure Layer - Config
export {
  getFirebaseAuth,
  isFirebaseAuthInitialized,
  getFirebaseAuthInitializationError,
  resetFirebaseAuthClient,
  firebaseAuthClient,
  initializeFirebaseAuth,
} from './domains/auth/infrastructure/config/FirebaseAuthClient';
export type { Auth } from './domains/auth/infrastructure/config/FirebaseAuthClient';

// Infrastructure Layer - Services
export {
  checkAuthState,
  isAuthenticated,
  isAnonymous,
  getCurrentUserId,
  getCurrentUser,
  getCurrentUserIdFromGlobal,
  getCurrentUserFromGlobal,
  isCurrentUserAuthenticated,
  isCurrentUserAnonymous,
  verifyUserId,
  isValidUser,
} from './domains/auth/infrastructure/services/auth-utils.service';
export type { AuthCheckResult } from './domains/auth/infrastructure/services/auth-utils.service';

export {
  AnonymousAuthService,
  anonymousAuthService,
} from './domains/auth/infrastructure/services/anonymous-auth.service';
export type {
  AnonymousAuthResult,
  AnonymousAuthServiceInterface,
} from './domains/auth/infrastructure/services/anonymous-auth.service';

export {
  shouldSkipFirestoreQuery,
  createFirestoreQueryOptions,
} from './domains/auth/infrastructure/services/firestore-utils.service';
export type {
  FirestoreQueryOptions,
  FirestoreQueryResult,
  FirestoreQuerySkipReason,
} from './domains/auth/infrastructure/services/firestore-utils.service';

// Social Auth Services
export {
  GoogleAuthService,
  googleAuthService,
} from './domains/auth/infrastructure/services/google-auth.service';
export type {
  GoogleAuthConfig,
  GoogleAuthResult,
} from './domains/auth/infrastructure/services/google-auth.types';

export {
  GoogleOAuthService,
  googleOAuthService,
} from './domains/auth/infrastructure/services/google-oauth.service';
export type { GoogleOAuthConfig } from './domains/auth/infrastructure/services/google-oauth.service';

export {
  AppleAuthService,
  appleAuthService,
} from './domains/auth/infrastructure/services/apple-auth.service';
export type { AppleAuthResult } from './domains/auth/infrastructure/services/apple-auth.types';

// Password & Email/Password Auth
export {
  updateUserPassword,
} from './domains/auth/infrastructure/services/password.service';

export {
  signInWithEmail,
  signUpWithEmail,
  signOut,
  linkAnonymousWithEmail,
} from './domains/auth/infrastructure/services/email-auth.service';
export type {
  EmailCredentials,
  EmailAuthResult,
} from './domains/auth/infrastructure/services/email-auth.service';

// Auth Listener
export {
  setupAuthListener,
} from './domains/auth/infrastructure/services/auth-listener.service';
export type {
  AuthListenerConfig,
  AuthListenerResult,
} from './domains/auth/infrastructure/services/auth-listener.service';

// User Document Service
export {
  ensureUserDocument,
  markUserDeleted,
  configureUserDocumentService,
} from './domains/auth/infrastructure/services/user-document.service';
export type {
  UserDocumentUser,
  UserDocumentConfig,
  UserDocumentExtras,
} from './domains/auth/infrastructure/services/user-document.types';

// Presentation Layer - Hooks
export { useFirebaseAuth } from './domains/auth/presentation/hooks/useFirebaseAuth';
export type { UseFirebaseAuthResult } from './domains/auth/presentation/hooks/useFirebaseAuth';

export { useAnonymousAuth } from './domains/auth/presentation/hooks/useAnonymousAuth';
export type { UseAnonymousAuthResult } from './domains/auth/presentation/hooks/useAnonymousAuth';

export { useSocialAuth } from './domains/auth/presentation/hooks/useSocialAuth';
export type {
  SocialAuthConfig,
  SocialAuthResult,
  UseSocialAuthResult,
} from './domains/auth/presentation/hooks/useSocialAuth';

export { useGoogleOAuth } from './domains/auth/presentation/hooks/useGoogleOAuth';
export type { UseGoogleOAuthResult } from './domains/auth/presentation/hooks/useGoogleOAuth';

// =============================================================================
// ACCOUNT DELETION DOMAIN EXPORTS
// =============================================================================

export {
  deleteCurrentUser,
  deleteUserAccount,
} from './domains/account-deletion/infrastructure/services/account-deletion.service';
export type { AccountDeletionResult } from './domains/account-deletion/infrastructure/services/account-deletion.service';

export type {
  AccountDeletionOptions,
  ReauthenticationResult,
  AuthProviderType,
  ReauthCredentialResult,
} from './domains/account-deletion/application/ports/reauthentication.types';

export {
  getUserAuthProvider,
  reauthenticateWithPassword,
  reauthenticateWithGoogle,
  reauthenticateWithApple,
  getAppleReauthCredential,
} from './domains/account-deletion/infrastructure/services/reauthentication.service';

// =============================================================================
// FIRESTORE DOMAIN EXPORTS
// =============================================================================

// Domain Errors
export {
  FirebaseFirestoreError,
  FirebaseFirestoreInitializationError,
  FirebaseFirestoreQuotaError,
} from './domains/firestore/domain/errors/FirebaseFirestoreError';

// Firestore Client
export {
  initializeFirestore,
  getFirestore,
  isFirestoreInitialized,
  getFirestoreInitializationError,
  resetFirestoreClient,
  firestoreClient,
} from './domains/firestore/infrastructure/config/FirestoreClient';
export type { Firestore } from './domains/firestore/infrastructure/config/FirestoreClient';

// Repositories
export { BaseRepository } from './domains/firestore/infrastructure/repositories/BaseRepository';
export type { IPathResolver } from './domains/firestore/infrastructure/repositories/BaseRepository';
export { BaseQueryRepository } from './domains/firestore/infrastructure/repositories/BaseQueryRepository';
export { BasePaginatedRepository } from './domains/firestore/infrastructure/repositories/BasePaginatedRepository';

// Date Utilities
export {
  isoToTimestamp,
  timestampToISO,
  timestampToDate,
  getCurrentISOString,
  formatRelativeTime,
} from './domains/firestore/utils/dateUtils';
export type { RelativeTimeLabels } from './domains/firestore/utils/dateUtils';

// Query Builder
export {
  buildQuery,
  createInFilter,
  createEqualFilter,
} from './domains/firestore/utils/query-builder';
export type {
  QueryBuilderOptions,
  FieldFilter,
} from './domains/firestore/utils/query-builder';

// Pagination
export {
  PaginationHelper,
  createPaginationHelper,
} from './domains/firestore/utils/pagination.helper';
export type {
  PaginatedResult,
  PaginationParams,
} from './domains/firestore/types/pagination.types';
export { EMPTY_PAGINATED_RESULT } from './domains/firestore/types/pagination.types';

// Domain Constants
export {
  FREE_TIER_LIMITS,
  QUOTA_THRESHOLDS,
  calculateQuotaUsage,
  isQuotaThresholdReached,
  getRemainingQuota,
} from './domains/firestore/domain/constants/QuotaLimits';

// Domain Entities
export type {
  QuotaMetrics,
  QuotaLimits,
  QuotaStatus,
} from './domains/firestore/domain/entities/QuotaMetrics';
export type {
  RequestLog,
  RequestStats,
  RequestType,
} from './domains/firestore/domain/entities/RequestLog';

// Domain Services
export { QuotaCalculator } from './domains/firestore/domain/services/QuotaCalculator';

// Quota Error Detection
export {
  isQuotaError,
  isRetryableError,
} from './shared/domain/utils/error-handlers/error-checkers';
export {
  ERROR_MESSAGES,
} from './shared/domain/utils/error-handlers/error-messages';

// Middleware
export {
  QueryDeduplicationMiddleware,
  queryDeduplicationMiddleware,
  syncDeduplicationWithQuota,
} from './domains/firestore/infrastructure/middleware/QueryDeduplicationMiddleware';
export type {
  QueryDeduplicationConfig,
  DeduplicationStatistics,
} from './domains/firestore/infrastructure/middleware/QueryDeduplicationMiddleware';
export {
  QuotaTrackingMiddleware,
  quotaTrackingMiddleware,
} from './domains/firestore/infrastructure/middleware/QuotaTrackingMiddleware';

// Services
export {
  RequestLoggerService,
  requestLoggerService,
} from './domains/firestore/infrastructure/services/RequestLoggerService';

// Firestore Helper Utilities
export {
  withFirestore,
  withFirestoreVoid,
  withFirestoreBool,
} from './domains/firestore/utils/operation/operation-executor.util';
export {
  runTransaction,
  serverTimestamp,
} from './domains/firestore/utils/transaction/transaction.util';
export {
  createErrorResult,
  createSuccessResult,
} from './domains/firestore/utils/result/result.util';
export type { NoDbResult } from './domains/firestore/utils/result/result.util';

// Validation Utilities
export {
  isValidCursor,
  validateCursorOrThrow,
  CursorValidationError,
} from './domains/firestore/utils/validation/cursor-validator.util';
export {
  isValidFieldName,
} from './domains/firestore/utils/validation/field-validator.util';
export {
  isValidDateRange,
  validateDateRangeOrThrow,
} from './domains/firestore/utils/validation/date-validator.util';

// Presentation — TanStack Query integration
export { useFirestoreQuery } from './domains/firestore/presentation/hooks/useFirestoreQuery';
export { useFirestoreMutation } from './domains/firestore/presentation/hooks/useFirestoreMutation';
export { useFirestoreSnapshot } from './domains/firestore/presentation/hooks/useFirestoreSnapshot';
export { useSmartFirestoreSnapshot, useSmartListenerControl } from './domains/firestore/presentation/hooks/useSmartFirestoreSnapshot';
export { createFirestoreKeys } from './domains/firestore/presentation/query-keys/createFirestoreKeys';

export type { UseFirestoreQueryOptions } from './domains/firestore/presentation/hooks/useFirestoreQuery';
export type { UseFirestoreMutationOptions } from './domains/firestore/presentation/hooks/useFirestoreMutation';
export type { UseFirestoreSnapshotOptions } from './domains/firestore/presentation/hooks/useFirestoreSnapshot';
export type { UseSmartFirestoreSnapshotOptions, BackgroundStrategy } from './domains/firestore/presentation/hooks/useSmartFirestoreSnapshot';

// Firebase Types
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

// Init Module Factory
export {
  createFirebaseInitModule,
  type FirebaseInitModuleConfig,
} from "./init";
