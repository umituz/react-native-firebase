/**
 * Error Handler Utility
 * Centralized error handling utilities for Firebase operations
 */

/**
 * Standard error structure with code and message
 */
export interface ErrorInfo {
  code: string;
  message: string;
}

/**
 * Quota error codes
 */
const QUOTA_ERROR_CODES = [
  'resource-exhausted',
  'quota-exceeded',
  'RESOURCE_EXHAUSTED',
];

/**
 * Quota error message patterns
 */
const QUOTA_ERROR_MESSAGES = [
  'quota exceeded',
  'quota limit',
  'daily limit',
  'resource exhausted',
  'too many requests',
];

/**
 * Retryable error codes
 */
const RETRYABLE_ERROR_CODES = ['unavailable', 'deadline-exceeded', 'aborted'];

/**
 * Type guard for error with code property
 * Uses proper type predicate instead of 'as' assertion
 */
export function hasCodeProperty(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

/**
 * Type guard for error with message property
 * Uses proper type predicate instead of 'as' assertion
 */
export function hasMessageProperty(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Convert unknown error to standard error info
 * Handles Error objects, strings, and unknown types
 */
export function toErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return {
      code: hasCodeProperty(error) ? error.code : 'unknown',
      message: error.message,
    };
  }
  return {
    code: 'unknown',
    message: typeof error === 'string' ? error : 'Unknown error',
  };
}

/**
 * Convert unknown error to auth error info
 * Auth-specific error codes are prefixed with 'auth/'
 */
export function toAuthErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    return {
      code: hasCodeProperty(error) && error.code ? error.code : 'auth/failed',
      message: error.message,
    };
  }
  return {
    code: 'auth/failed',
    message: typeof error === 'string' ? error : 'Unknown error',
  };
}

/**
 * Check if error info has a specific error code
 */
export function hasErrorCode(error: ErrorInfo, code: string): boolean {
  return error.code === code;
}

/**
 * Check if error is a cancelled/auth cancelled error
 */
export function isCancelledError(error: ErrorInfo): boolean {
  return (
    error.code === 'auth/cancelled' ||
    error.message.includes('ERR_CANCELED')
  );
}

/**
 * Check if error info is a quota error
 */
export function isQuotaErrorInfo(error: ErrorInfo): boolean {
  return (
    error.code === 'quota-exceeded' ||
    error.code.includes('quota') ||
    error.message.toLowerCase().includes('quota')
  );
}

/**
 * Check if error info is a network error
 */
export function isNetworkError(error: ErrorInfo): boolean {
  return (
    error.code.includes('network') ||
    error.message.toLowerCase().includes('network')
  );
}

/**
 * Check if error info is an authentication error
 */
export function isAuthError(error: ErrorInfo): boolean {
  return error.code.startsWith('auth/');
}

/**
 * Check if unknown error is a Firestore quota error
 * Enhanced type guard with proper error checking
 */
export function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  if (hasCodeProperty(error)) {
    const code = error.code;
    return QUOTA_ERROR_CODES.some(
      (c) => code === c || code.endsWith(`/${c}`) || code.startsWith(`${c}/`)
    );
  }

  if (hasMessageProperty(error)) {
    const message = error.message.toLowerCase();
    return QUOTA_ERROR_MESSAGES.some((m) => {
      const pattern = m.toLowerCase();
      return (
        message.includes(` ${pattern} `) ||
        message.startsWith(`${pattern} `) ||
        message.endsWith(` ${pattern}`) ||
        message === pattern
      );
    });
  }

  return false;
}

/**
 * Check if error is retryable
 */
export function isRetryableError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  if (hasCodeProperty(error)) {
    return RETRYABLE_ERROR_CODES.some((code) => error.code.includes(code));
  }

  return false;
}

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
