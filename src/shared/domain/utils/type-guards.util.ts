/**
 * Type Guard Utilities
 *
 * Common type guards for Firebase and JavaScript objects.
 * Provides type-safe checking without using 'as' assertions.
 */

/**
 * Type guard for non-null objects
 * Eliminates duplicate object checking pattern throughout the codebase
 *
 * @example
 * ```typescript
 * if (isObject(value)) {
 *   // value is Record<string, unknown>
 * }
 * ```
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Type guard for objects with a specific property
 *
 * @param value - Value to check
 * @param key - Property key to check for
 * @returns True if value is an object with the specified property
 */
export function hasProperty<K extends string>(
  value: unknown,
  key: K
): value is Record<K, unknown> {
  return isObject(value) && key in value;
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
    isObject(error) &&
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
    isObject(error) &&
    'stack' in error &&
    typeof (error as { stack: unknown }).stack === 'string'
  );
}
