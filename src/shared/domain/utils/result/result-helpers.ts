/**
 * Result Helpers
 * Utility functions for working with Result type
 * Optimized for minimal property access
 */

import type { Result, SuccessResult, FailureResult } from './result-types';

/**
 * Check if result is successful
 * Optimized: Single boolean check
 */
export function isSuccess<T>(result: Result<T>): result is SuccessResult<T> {
  return result.success === true;
}

/**
 * Check if result is a failure
 * Optimized: Single boolean check (opposite of success)
 */
export function isFailure<T>(result: Result<T>): result is FailureResult {
  return result.success === false;
}
