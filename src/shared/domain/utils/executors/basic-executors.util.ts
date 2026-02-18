/**
 * Basic Async Executors
 * Core async operation execution with error handling
 */

import type { Result } from '../result/result-types';
import { successResult } from '../result/result-creators';
import { toErrorInfo } from '../error-handlers/error-converters';

/**
 * Error converter function type
 */
type ErrorConverter = (error: unknown) => { code: string; message: string };

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
    const converter = errorConverter ?? ((err: unknown) => toErrorInfo(err, 'operation/failed'));
    return { success: false, error: converter(error) };
  }
}

/**
 * Execute async operation with auth error handling
 */
export async function executeAuthOperation<T>(
  operation: () => Promise<T>
): Promise<Result<T>> {
  return executeOperation(operation, (error: unknown) => toErrorInfo(error, 'auth/failed'));
}
