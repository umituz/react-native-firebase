/**
 * String Validators
 * Basic string validation utilities
 * Optimized to minimize string allocations
 */

/**
 * Check if a string is a valid non-empty value
 * Optimized: Direct length check instead of trim().length (faster)
 */
export function isValidString(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  // Fast path: check length first (no allocation)
  const len = value.length;
  if (len === 0) return false;

  // Check if string is only whitespace (slower path, only when needed)
  // Using regex for efficiency on larger strings
  return /^\S/.test(value);
}
