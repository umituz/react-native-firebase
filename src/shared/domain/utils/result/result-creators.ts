/**
 * Result Creators
 * Factory functions for creating Result instances
 * Optimized: Minimized object allocations and function calls
 */

import type { SuccessResult, FailureResult, ErrorInfo } from './result-types';
import { toErrorInfo } from '../error-handlers/error-converters';

/**
 * Create a success result with optional data
 * Optimized: Single return statement, minimal casting
 */
export function successResult(): SuccessResult<void>;
export function successResult<T>(data: T): SuccessResult<T>;
export function successResult<T = void>(data?: T): SuccessResult<T> {
  // Direct object creation without intermediate variables
  return { success: true, data: data as T };
}

/**
 * Create a failure result with error information
 * Internal helper: Inline for performance (not exported directly)
 */
function failureResult(error: ErrorInfo): FailureResult {
  return { success: false, error };
}

/**
 * Create a failure result from error code and message
 * Optimized: Direct object creation
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
