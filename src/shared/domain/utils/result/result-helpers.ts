/**
 * Result Helpers
 * Utility functions for working with Result type
 */

import type { Result, SuccessResult, FailureResult } from './result-types';

/**
 * Check if result is successful
 */
export function isSuccess<T>(result: Result<T>): result is SuccessResult<T> {
  return result.success === true && result.error === undefined;
}

/**
 * Check if result is a failure
 */
export function isFailure<T>(result: Result<T>): result is FailureResult {
  return result.success === false && result.error !== undefined;
}
