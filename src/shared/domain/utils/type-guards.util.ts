/**
 * Type Guard Utilities
 *
 * Common type guards for Firebase and JavaScript objects.
 * Provides type-safe checking without using 'as' assertions.
 */

/**
 * Type guard for non-null objects
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Type guard for objects with a 'code' property of type string
 * Commonly used for Firebase errors and other error objects
 */
export function hasCodeProperty(error: unknown): error is { code: string } {
  return (
    isObject(error) &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string'
  );
}

/**
 * Type guard for objects with a 'message' property of type string
 * Commonly used for Error objects
 */
export function hasMessageProperty(error: unknown): error is { message: string } {
  return (
    isObject(error) &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}
