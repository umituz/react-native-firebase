/**
 * Generic Validators
 * Generic validation utilities for arrays, numbers, and objects
 */

/**
 * Check if array is not empty
 */
export function isNonEmptyArray<T>(value: unknown): value is [T, ...T[]] {
  return Array.isArray(value) && value.length > 0;
}

/**
 * Check if number is in range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return typeof value === 'number' && value >= min && value <= max;
}

/**
 * Check if number is positive
 */
export function isPositive(value: number): boolean {
  return typeof value === 'number' && value > 0;
}

/**
 * Check if number is non-negative
 */
export function isNonNegative(value: number): boolean {
  return typeof value === 'number' && value >= 0;
}

/**
 * Validate object has required properties
 */
export function hasRequiredProperties<T extends Record<string, unknown>>(
  obj: unknown,
  requiredProps: (keyof T)[]
): obj is T {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  return requiredProps.every((prop) => prop in obj);
}

/**
 * Validate all items in array match predicate
 */
export function allMatch<T>(items: unknown[], predicate: (item: unknown) => item is T): boolean {
  return Array.isArray(items) && items.every(predicate);
}

/**
 * Validate at least one item in array matches predicate
 */
export function anyMatch<T>(items: unknown[], predicate: (item: unknown) => item is T): boolean {
  return Array.isArray(items) && items.some(predicate);
}
