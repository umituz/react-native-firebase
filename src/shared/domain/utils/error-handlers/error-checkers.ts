/**
 * Error Type Checkers
 * Check error types and categories
 */

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
 * Check if error is a cancelled/auth cancelled error
 */
export function isCancelledError(error: { code: string; message: string }): boolean {
  return (
    error.code === 'auth/cancelled' ||
    error.message.includes('ERR_CANCELED')
  );
}

/**
 * Check if unknown error is a Firestore quota error
 * Enhanced type guard with proper error checking
 */
export function isQuotaError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;

  if (hasCodeProperty(error)) {
    const code = error.code.toLowerCase();
    return QUOTA_ERROR_CODES.map(c => c.toLowerCase()).some(
      (c) => code === c || code.endsWith(`/${c}`) || code.startsWith(`${c}/`)
    );
  }

  if (hasMessageProperty(error)) {
    const message = error.message.toLowerCase();
    return QUOTA_ERROR_MESSAGES.some((m) => {
      const pattern = m.toLowerCase();
      // More flexible matching: handle hyphens, underscores, and no spaces
      const normalizedMessage = message.replace(/[-_\s]+/g, ' ');
      const normalizedPattern = pattern.replace(/[-_\s]+/g, ' ');
      return normalizedMessage.includes(normalizedPattern);
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
