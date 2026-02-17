import type { Result } from '../result.util';
import { failureResultFromError, successResult, isSuccess, isFailure } from '../result.util';

export async function executeAll<T>(
  ...operations: (() => Promise<Result<T>>)[]
): Promise<Result<T[]>> {
  try {
    const results = await Promise.all(operations.map((op) => op()));

    // FIX: Use isFailure() type guard instead of manual check
    for (const result of results) {
      if (isFailure(result)) {
        return result;
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
    // FIX: Use isFailure() type guard instead of manual check
    if (isFailure(result)) {
      return { success: false, error: result.error };
    }
  }
  return successResult();
}
