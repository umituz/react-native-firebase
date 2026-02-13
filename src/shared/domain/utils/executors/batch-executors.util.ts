/**
 * Batch Async Executors
 * Execute multiple operations in parallel or sequence
 */

import type { Result, FailureResult } from '../result.util';
import { failureResultFromError, successResult } from '../result.util';

/**
 * Execute multiple operations in parallel
 * Returns success only if all operations succeed
 */
export async function executeAll<T>(
  ...operations: (() => Promise<Result<T>>)[]
): Promise<Result<T[]>> {
  try {
    const results = await Promise.all(operations.map((op) => op()));
    const failures = results.filter((r) => !r.success);
    if (failures.length > 0) {
      return failures[0] as FailureResult;
    }
    const data = results.map((r) => (r as { success: true; data: T }).data);
    return successResult(data);
  } catch (error) {
    return failureResultFromError(error);
  }
}

/**
 * Execute operations in sequence, stopping at first failure
 */
export async function executeSequence<T>(
  ...operations: (() => Promise<Result<T>>)[]
): Promise<Result<void>> {
  for (const operation of operations) {
    const result = await operation();
    if (!result.success) {
      return result as Result<void>;
    }
  }
  return successResult();
}
