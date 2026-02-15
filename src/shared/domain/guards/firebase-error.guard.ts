/**
 * Firebase Error Type Guards
 * Single Responsibility: Provide type-safe error checking utilities
 *
 * Provides type guards for Firebase errors to ensure type safety
 * when handling errors from Firebase SDK operations.
 */

import type { FirestoreError } from 'firebase/firestore';
import type { AuthError } from 'firebase/auth';
import { hasCodeProperty } from '../utils/type-guards.util';

/**
 * Firebase error base interface
 */
interface FirebaseErrorBase {
  code: string;
  message: string;
}

/**
 * Check if error is a Firebase Firestore error
 */
export function isFirestoreError(error: unknown): error is FirestoreError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'message' in error &&
    // FIX: Also check that properties are strings
    typeof (error as any).code === 'string' &&
    typeof (error as any).message === 'string'
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
    'message' in error &&
    // FIX: Also check that properties are strings
    typeof (error as any).code === 'string' &&
    typeof (error as any).message === 'string'
  );
}

/**
 * Check if error is a Firebase error (either Firestore or Auth)
 */
export function isFirebaseError(error: unknown): error is FirebaseErrorBase {
  return isFirestoreError(error) || isAuthError(error);
}

/**
 * Check if error has a specific code
 */
export function hasErrorCode(error: unknown, code: string): boolean {
  return hasCodeProperty(error) && error.code === code;
}

/**
 * Check if error code matches any of the provided codes
 */
export function hasAnyErrorCode(error: unknown, codes: string[]): boolean {
  if (!hasCodeProperty(error)) return false;
  return codes.includes(error.code);
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return hasAnyErrorCode(error, ['unavailable', 'network-request-failed', 'timeout']);
}

/**
 * Check if error is a permission denied error
 */
export function isPermissionDeniedError(error: unknown): boolean {
  return hasAnyErrorCode(error, ['permission-denied', 'unauthorized']);
}

/**
 * Check if error is a not found error
 */
export function isNotFoundError(error: unknown): boolean {
  return hasErrorCode(error, 'not-found');
}

/**
 * Check if error is a quota exceeded error
 */
export function isQuotaExceededError(error: unknown): boolean {
  return hasErrorCode(error, 'resource-exhausted');
}

/**
 * Get safe error message
 * Returns error message or unknown error message
 */
export function getSafeErrorMessage(error: unknown): string {
  if (isFirebaseError(error)) {
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
  if (hasCodeProperty(error)) {
    return error.code;
  }

  return 'unknown';
}
