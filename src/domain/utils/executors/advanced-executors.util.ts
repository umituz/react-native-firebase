/**
 * Advanced Async Executors
 * Retry and timeout support for async operations
 */

import type { Result } from '../result.util';
import { failureResultFromError, successResult } from '../result.util';
import { executeOperation } from './basic-executors.util';

/**
 * Execute operation with retry
 * @param operation - Operation to execute
 * @param maxRetries - Maximum number of retries (default: 3)
 * @param delayMs - Base delay between retries in milliseconds (default: 1000)
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
        // Exponential backoff: delay * (attempt + 1)
        await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
      }
    }
  }
  return failureResultFromError(lastError);
}

/**
 * Execute operation with timeout
 * @param operation - Operation to execute
 * @param timeoutMs - Timeout in milliseconds
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
