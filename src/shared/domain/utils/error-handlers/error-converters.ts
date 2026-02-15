/**
 * Error Converters
 * Convert unknown errors to ErrorInfo
 */

import { hasCodeProperty } from '../type-guards.util';
import type { ErrorInfo } from '../result/result-types';

/**
 * Convert unknown error to standard error info
 * Handles Error objects, strings, and unknown types
 * @param error - Unknown error object
 * @param defaultCode - Default error code if none found (e.g., 'auth/failed', 'firestore/error')
 */
export function toErrorInfo(error: unknown, defaultCode: string = 'unknown'): ErrorInfo {
  if (error instanceof Error) {
    return {
      code: hasCodeProperty(error) ? error.code : defaultCode,
      message: error.message,
    };
  }
  return {
    code: defaultCode,
    message: typeof error === 'string' ? error : 'Unknown error',
  };
}
