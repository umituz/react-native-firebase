/**
 * Error Handler Utility
 * Re-exports all error handling utilities for backward compatibility
 * @deprecated Import from specific error-handler files instead
 */

// Error Converters
export type { ErrorInfo } from './error-handlers/error-converters';
export { toErrorInfo, toAuthErrorInfo } from './error-handlers/error-converters';

// Error Checkers
export {
  hasErrorCode,
  isCancelledError,
  isQuotaErrorInfo,
  isNetworkError,
  isAuthError,
  isQuotaError,
  isRetryableError,
} from './error-handlers/error-checkers';

// Error Messages
export { getQuotaErrorMessage, getRetryableErrorMessage } from './error-handlers/error-messages';

// Re-export type guards for convenience
export { hasCodeProperty, hasMessageProperty, hasCodeAndMessageProperties } from './type-guards.util';
