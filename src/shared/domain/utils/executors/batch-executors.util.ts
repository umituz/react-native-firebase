import type { Result, FailureResult } from '../result.util';
import { failureResultFromError, successResult, isSuccess } from '../result.util';

export async function executeAll<T>(
  ...operations: (() => Promise<Result<T>>)[]
): Promise<Result<T[]>> {
  try {
    const results = await Promise.all(operations.map((op) => op()));

    for (const result of results) {
      if (!result.success && result.error !== undefined) {
        return result as FailureResult;
      }
    }

    const data: T[] = [];
    for (const result of results) {
      if (isSuccess(result) && result.data !== undefined) {
        data.push(result.data);
      }
    }

    return successResult(data);
  } catch (error) {
    return failureResultFromError(error);
  }
}

export async function executeSequence<T>(
  ...operations: (() => Promise<Result<T>>)[]
): Promise<Result<void>> {
  for (const operation of operations) {
    const result = await operation();
    if (!result.success && result.error !== undefined) {
      return { success: false, error: result.error };
    }
  }
  return successResult();
}
