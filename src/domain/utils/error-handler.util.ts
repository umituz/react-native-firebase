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
 * Convert unknown error to standard error info
 * Handles Error objects, strings, and unknown types
 */
export function toErrorInfo(error: unknown): ErrorInfo {
  if (error instanceof Error) {
    const firebaseErr = error as { code?: string };
    return {
      code: firebaseErr.code || 'unknown',
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
    const firebaseErr = error as { code?: string };
    return {
      code: firebaseErr.code || 'auth/failed',
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
  return error.code === 'auth/cancelled' || error.message.includes('ERR_CANCELED');
}

/**
 * Check if error is a quota exceeded error
 */
export function isQuotaError(error: ErrorInfo): boolean {
  return (
    error.code === 'quota-exceeded' ||
    error.code.includes('quota') ||
    error.message.toLowerCase().includes('quota')
  );
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: ErrorInfo): boolean {
  return (
    error.code.includes('network') ||
    error.message.toLowerCase().includes('network')
  );
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: ErrorInfo): boolean {
  return error.code.startsWith('auth/');
}
