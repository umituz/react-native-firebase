/**
 * Type Guard Utilities
 *
 * Common type guards for Firebase and JavaScript objects.
 * Provides type-safe checking without using 'as' assertions.
 */

/**
 * Type guard for objects with a 'code' property of type string
 * Commonly used for Firebase errors and other error objects
 */
export function hasCodeProperty(error: unknown): error is { code: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
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
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  );
}

/**
 * Type guard for objects with both 'code' and 'message' properties
 * Commonly used for Firebase error objects
 */
export function hasCodeAndMessageProperties(error: unknown): error is { code: string; message: string } {
  return hasCodeProperty(error) && hasMessageProperty(error);
}

/**
 * Type guard for objects with a 'name' property of type string
 * Commonly used for Error objects
 */
export function hasNameProperty(error: unknown): error is { name: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    typeof (error as { name: unknown }).name === 'string'
  );
}

/**
 * Type guard for objects with a 'stack' property of type string
 * Commonly used for Error objects
 */
export function hasStackProperty(error: unknown): error is { stack: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stack' in error &&
    typeof (error as { stack: unknown }).stack === 'string'
  );
}
