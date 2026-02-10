/**
 * Async Operation Executor Utility
 * Centralized async operation execution with error handling
 * Eliminates code duplication across services
 */

import type { Result, FailureResult } from './result.util';
import { failureResultFromError, successResult } from './result.util';

/**
 * Error converter function type
 * Converts unknown errors to ErrorInfo
 */
export type ErrorConverter = (error: unknown) => { code: string; message: string };

/**
 * Default error converter for auth operations
 */
export function authErrorConverter(error: unknown): { code: string; message: string } {
  if (error instanceof Error) {
    return {
      code: (error as { code?: string }).code ?? 'auth/failed',
      message: error.message,
    };
  }
  return {
    code: 'auth/failed',
    message: typeof error === 'string' ? error : 'Authentication failed',
  };
}

/**
 * Default error converter for operations
 */
export function defaultErrorConverter(
  error: unknown,
  defaultCode = 'operation/failed'
): { code: string; message: string } {
  if (error instanceof Error) {
    return {
      code: (error as { code?: string }).code ?? defaultCode,
      message: error.message,
    };
  }
  return {
    code: defaultCode,
    message: typeof error === 'string' ? error : 'Operation failed',
  };
}

/**
 * Execute async operation with error handling
 * Returns Result type with success/failure
 */
export async function executeOperation<T>(
  operation: () => Promise<T>,
  errorConverter?: ErrorConverter
): Promise<Result<T>> {
  try {
    const data = await operation();
    return successResult(data);
  } catch (error) {
    const converter = errorConverter ?? defaultErrorConverter;
    return { success: false, error: converter(error) };
  }
}

/**
 * Execute async operation with error handling and default code
 */
export async function executeOperationWithCode<T>(
  operation: () => Promise<T>,
  defaultErrorCode = 'operation/failed'
): Promise<Result<T>> {
  return executeOperation(operation, (error) => defaultErrorConverter(error, defaultErrorCode));
}

/**
 * Execute async void operation
 * Useful for operations that don't return data
 */
export async function executeVoidOperation(
  operation: () => Promise<void>,
  errorConverter?: ErrorConverter
): Promise<Result<void>> {
  return executeOperation(operation, errorConverter) as Promise<Result<void>>;
}

/**
 * Execute async operation with auth error handling
 */
export async function executeAuthOperation<T>(
  operation: () => Promise<T>
): Promise<Result<T>> {
  return executeOperation(operation, authErrorConverter);
}

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

/**
 * Execute operation with retry
 */
export async function executeWithRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delayMs = 1000
): Promise<Result<T>> {
  let lastError: unknown;
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const data = await operation();
      return successResult(data);
    } catch (error) {
      lastError = error;
      if (i < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  return failureResultFromError(lastError);
}

/**
 * Execute operation with timeout
 */
export async function executeWithTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number
): Promise<Result<T>> {
  return Promise.race([
    executeOperation(operation),
    new Promise<Result<T>>((resolve) =>
      setTimeout(
        () =>
          resolve({
            success: false,
            error: { code: 'timeout', message: `Operation timed out after ${timeoutMs}ms` },
          }),
        timeoutMs
      )
    ),
  ]);
}
