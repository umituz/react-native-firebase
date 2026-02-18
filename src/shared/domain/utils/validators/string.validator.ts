/**
 * String Validators
 * Basic string validation utilities
 */

/**
 * Check if a string is a valid non-empty value
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}
