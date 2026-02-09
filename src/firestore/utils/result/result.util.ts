/**
 * Result Utility
 * Utilities for creating Firestore result objects
 */

export interface FirestoreResult<T> {
  success: boolean;
  data?: T;
  error?: { message: string; code: string };
}

export type NoDbResult = FirestoreResult<never>;

export const NO_DB_ERROR: NoDbResult = {
  success: false,
  error: { message: "No DB", code: "DB_ERR" },
};

/**
 * Create a standard error result
 */
export function createErrorResult<T>(message: string, code: string): FirestoreResult<T> {
  return { success: false, error: { message, code } };
}

/**
 * Create a standard success result
 */
export function createFirestoreSuccessResult<T>(data?: T): FirestoreResult<T> {
  return { success: true, data };
}

/**
 * Create no-db error result with proper typing
 */
export function createNoDbErrorResult<T>(): FirestoreResult<T> {
  return { success: false, error: NO_DB_ERROR.error };
}

/**
 * Check if result is successful
 */
export function isSuccess<T>(result: FirestoreResult<T>): result is FirestoreResult<T> & { success: true } {
  return result.success;
}

/**
 * Check if result is an error
 */
export function isError<T>(result: FirestoreResult<T>): result is FirestoreResult<T> & { success: false } {
  return !result.success;
}

// Keep old function name for backwards compatibility
export const createSuccessResult = createFirestoreSuccessResult;
