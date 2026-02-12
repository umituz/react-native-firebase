/**
 * Error Converters
 * Convert unknown errors to ErrorInfo
 */

import { hasCodeProperty } from '../type-guards.util';

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
