/**
 * Quota Error Detection Utilities
 *
 * Re-exports centralized quota error detection from error-handler.util.ts
 * This maintains backwards compatibility while using a single source of truth.
 */

export {
  isQuotaError,
  isRetryableError,
  getQuotaErrorMessage,
  getRetryableErrorMessage,
} from '../../domain/utils/error-handler.util';
