/**
 * Result Helpers
 * Utility functions for working with Result type
 */

import type { Result, SuccessResult, FailureResult } from './result-types';
import { successResult } from './result-creators';

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
  return result.success === false;
}

/**
 * Get data from result or return default
 */
export function getDataOrDefault<T>(result: Result<T>, defaultValue: T): T {
  return isSuccess(result) ? (result.data ?? defaultValue) : defaultValue;
}

/**
 * Map success result data to another type
 */
export function mapResult<T, U>(
  result: Result<T>,
  mapper: (data: T) => U
): Result<U> {
  if (isSuccess(result) && result.data !== undefined) {
    return successResult(mapper(result.data));
  }
  // Return a new failure result to avoid type conflicts
  if (isFailure(result)) {
    return { success: false, error: result.error };
  }
  return successResult();
}

/**
 * Chain multiple results, stopping at first failure
 */
export async function chainResults<T>(
  ...operations: (() => Promise<Result<T>>)[]
): Promise<Result<T>> {
  for (const operation of operations) {
    const result = await operation();
    if (isFailure(result)) {
      return result;
    }
  }
  return successResult();
}
