/**
 * Error Type Checkers
 * Check error types and categories
 */

import type { ErrorInfo } from './error-converters';
import { hasCodeProperty, hasMessageProperty } from '../type-guards.util';

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
