/**
 * Error Messages
 * User-friendly error messages for common error types
 */

/**
 * Get user-friendly quota error message
 */
export function getQuotaErrorMessage(): string {
  return 'Daily quota exceeded. Please try again tomorrow or upgrade your plan.';
}

/**
 * Get user-friendly retryable error message
 */
export function getRetryableErrorMessage(): string {
  return 'Temporary error occurred. Please try again.';
}
