/**
 * Result Helpers
 * Utility functions for working with Result type
 */

import type { Result, SuccessResult } from './result-types';

/**
 * Check if result is successful
 */
export function isSuccess<T>(result: Result<T>): result is SuccessResult<T> {
  return result.success === true && result.error === undefined;
}
