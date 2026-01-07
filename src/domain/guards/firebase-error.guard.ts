/**
 * Firebase Error Type Guards
 * Single Responsibility: Provide type-safe error checking utilities
 *
 * Provides type guards for Firebase errors to ensure type safety
 * when handling errors from Firebase SDK operations.
 */

import type { FirestoreError } from 'firebase/firestore';
import type { AuthError } from 'firebase/auth';

/**
 * Check if error is a Firebase Firestore error
 */
export function isFirestoreError(error: unknown): error is FirestoreError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Check if error is a Firebase Auth error
 */
export function isAuthError(error: unknown): error is AuthError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error
  );
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (!isFirestoreError(error) && !isAuthError(error)) {
    return false;
  }

  const code = (error as FirestoreError | AuthError).code;
  return (
    code === 'unavailable' ||
    code === 'network-request-failed' ||
    code === 'timeout'
  );
}

/**
 * Check if error is a permission denied error
 */
export function isPermissionDeniedError(error: unknown): boolean {
  if (!isFirestoreError(error) && !isAuthError(error)) {
    return false;
  }

  const code = (error as FirestoreError | AuthError).code;
  return code === 'permission-denied' || code === 'unauthorized';
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  if (!isFirestoreError(error)) {
    return false;
  }

  return (error as FirestoreError).code === 'not-found';
}

/**
 * Check if error is a quota exceeded error
 */
export function isQuotaExceededError(error: unknown): boolean {
  if (!isFirestoreError(error)) {
    return false;
  }

  return (error as FirestoreError).code === 'resource-exhausted';
}

/**
 * Get safe error message
 * Returns error message or unknown error message
 */
export function getSafeErrorMessage(error: unknown): string {
  if (isFirestoreError(error) || isAuthError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return 'An unknown error occurred';
}

/**
 * Get safe error code
 * Returns error code or unknown error code
 */
export function getSafeErrorCode(error: unknown): string {
  if (isFirestoreError(error) || isAuthError(error)) {
    return error.code;
  }

  return 'unknown';
}
