/**
 * Typed Guard Utilities
 * Single Responsibility: Provide type-safe guard utilities
 *
 * Consolidates all type guards to eliminate duplication across 6+ files.
 * Provides type-safe checking without using 'as' assertions.
 * Optimized for performance with minimal type assertions.
 *
 * Max lines: 150 (enforced for maintainability)
 */

/**
 * Type guard for non-null objects
 * Inline function for better performance
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

/**
 * Type guard for objects with a 'code' property of type string
 * Commonly used for Firebase errors and other error objects
 * Optimized: Reduced type assertions by using 'in' operator check first
 */
export function hasCodeProperty(error: unknown): error is { code: string } {
  return isObject(error) && 'code' in error && typeof error.code === 'string';
}

/**
 * Type guard for objects with a 'message' property of type string
 * Commonly used for Error objects
 * Optimized: Reduced type assertions by using 'in' operator check first
 */
export function hasMessageProperty(error: unknown): error is { message: string } {
  return isObject(error) && 'message' in error && typeof error.message === 'string';
}

/**
 * Type guard for objects with both 'code' and 'message' properties
 * Commonly used for Firebase errors
 */
export function isFirebaseErrorLike(error: unknown): error is { code: string; message: string } {
  return hasCodeProperty(error) && hasMessageProperty(error);
}

/**
 * Type guard for objects with a 'name' property of type string
 * Commonly used for Error objects
 */
export function hasNameProperty(error: unknown): error is { name: string } {
  return isObject(error) && 'name' in error && typeof error.name === 'string';
}

/**
 * Type guard for Error instances
 * More reliable than instanceof for cross-realm errors
 */
export function isErrorLike(value: unknown): value is Error {
  return (
    isObject(value) &&
    'message' in value &&
    typeof value.message === 'string' &&
    'stack' in value &&
    (typeof value.stack === 'string' || value.stack === undefined)
  );
}

/**
 * Type guard for objects with a 'uid' property of type string
 * Commonly used for Firebase user objects
 */
export function hasUidProperty(obj: unknown): obj is { uid: string } {
  return isObject(obj) && 'uid' in obj && typeof obj.uid === 'string';
}

/**
 * Type guard for objects with a 'email' property of type string
 * Commonly used for Firebase user objects
 */
export function hasEmailProperty(obj: unknown): obj is { email: string | null } {
  return isObject(obj) && 'email' in obj && (typeof obj.email === 'string' || obj.email === null);
}

/**
 * Type guard for objects with a 'providerId' property
 * Commonly used for Firebase user info objects
 */
export function hasProviderIdProperty(obj: unknown): obj is { providerId: string } {
  return isObject(obj) && 'providerId' in obj && typeof obj.providerId === 'string';
}

/**
 * Type guard for arrays
 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Type guard for strings
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/**
 * Type guard for functions
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/**
 * Check if object has a specific property
 */
export function hasProperty<T extends string>(
  obj: unknown,
  prop: T
): obj is Record<T, unknown> {
  return isObject(obj) && prop in obj;
}

/**
 * Check if object has multiple properties
 */
export function hasProperties<T extends string>(
  obj: unknown,
  props: T[]
): obj is Record<T, unknown> {
  return isObject(obj) && props.every(prop => prop in obj);
}
