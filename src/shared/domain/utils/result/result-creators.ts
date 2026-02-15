/**
 * Result Creators
 * Factory functions for creating Result instances
 */

import type { SuccessResult, FailureResult, ErrorInfo } from './result-types';
import { toErrorInfo } from '../error-handlers/error-converters';

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
 * Uses consolidated error converter for consistency
 */
export function failureResultFromError(error: unknown, defaultCode = 'operation/failed'): FailureResult {
  return failureResult(toErrorInfo(error, defaultCode));
}
