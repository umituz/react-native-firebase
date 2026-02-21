/**
 * Result Utility
 * Utilities for creating Firestore result objects
 */

import type { Result, FailureResult } from '../../../../shared/domain/utils/result/result-types';

export type NoDbResult = FailureResult;

const NO_DB_ERROR: NoDbResult = {
  success: false,
  error: { message: "Firestore is not initialized", code: "firestore/not-initialized" },
};

/**
 * Create a standard error result
 */
export function createErrorResult<T>(message: string, code: string): Result<T> {
  return { success: false, error: { message, code } };
}

/**
 * Create a standard success result
 */
export function createSuccessResult(): Result<void>;
export function createSuccessResult<T>(data: T): Result<T>;
export function createSuccessResult<T = void>(data?: T): Result<T> {
  return { success: true, data: data as T };
}

/**
 * Create no-db error result with proper typing
 */
export function createNoDbErrorResult<T>(): Result<T> {
  return { success: false, error: NO_DB_ERROR.error };
}
