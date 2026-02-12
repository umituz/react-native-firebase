/**
 * Result Creators
 * Factory functions for creating Result instances
 */

import type { SuccessResult, FailureResult, ErrorInfo } from './result-types';

/**
 * Create a success result with optional data
 */
export function successResult<T = void>(data?: T): SuccessResult<T> {
  return { success: true, data: data as T };
}

/**
 * Create a failure result with error information
 */
export function failureResult(error: ErrorInfo): FailureResult {
  return { success: false, error };
}

/**
 * Create a failure result from error code and message
 */
export function failureResultFrom(code: string, message: string): FailureResult {
  return { success: false, error: { code, message } };
}

/**
 * Create a failure result from an unknown error
 */
export function failureResultFromError(error: unknown, defaultCode = 'operation/failed'): FailureResult {
  if (error instanceof Error) {
    return {
      success: false,
      error: {
        code: (error as { code?: string }).code ?? defaultCode,
        message: error.message,
      },
    };
  }
  return {
    success: false,
    error: {
      code: defaultCode,
      message: typeof error === 'string' ? error : 'Unknown error occurred',
    },
  };
}
