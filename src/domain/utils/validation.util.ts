/**
 * Validation Utility
 * Centralized validation utilities for common patterns
 */

/**
 * Check if a string is a valid non-empty value
 */
export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Check if a string is empty or whitespace only
 */
export function isEmptyString(value: unknown): boolean {
  return typeof value === 'string' && value.trim().length === 0;
}

/**
 * Validate Firebase API key format
 * Firebase API keys typically start with "AIza" followed by 35 characters
 */
export function isValidFirebaseApiKey(apiKey: string): boolean {
  if (!isValidString(apiKey)) {
    return false;
  }
  const apiKeyPattern = /^AIza[0-9A-Za-z_-]{35}$/;
  return apiKeyPattern.test(apiKey.trim());
}

/**
 * Validate Firebase authDomain format
 * Expected format: "projectId.firebaseapp.com" or "projectId.web.app"
 */
export function isValidFirebaseAuthDomain(authDomain: string): boolean {
  if (!isValidString(authDomain)) {
    return false;
  }
  const trimmed = authDomain.trim();
  return (
    trimmed.includes('.firebaseapp.com') ||
    trimmed.includes('.web.app')
  );
}

/**
 * Validate Firebase projectId format
 * Project IDs must be 6-30 characters, lowercase, alphanumeric, and may contain hyphens
 */
export function isValidFirebaseProjectId(projectId: string): boolean {
  if (!isValidString(projectId)) {
    return false;
  }
  const pattern = /^[a-z0-9][a-z0-9-]{4,28}[a-z0-9]$/;
  return pattern.test(projectId.trim());
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!isValidString(url)) {
    return false;
  }
  try {
    new URL(url.trim());
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate HTTPS URL
 */
export function isValidHttpsUrl(url: string): boolean {
  if (!isValidString(url)) {
    return false;
  }
  try {
    const urlObj = new URL(url.trim());
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!isValidString(email)) {
    return false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email.trim());
}

/**
 * Check if value is defined (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

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
 * Validate password strength
 * At least 8 characters, containing uppercase, lowercase, and number
 */
export function isStrongPassword(password: string): boolean {
  if (!isValidString(password) || password.length < 8) {
    return false;
  }
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return hasUpperCase && hasLowerCase && hasNumber;
}

/**
 * Validate username format
 * Alphanumeric, underscores, and hyphens, 3-20 characters
 */
export function isValidUsername(username: string): boolean {
  if (!isValidString(username)) {
    return false;
  }
  const pattern = /^[a-zA-Z0-9_-]{3,20}$/;
  return pattern.test(username);
}

/**
 * Validate phone number format (basic check)
 */
export function isValidPhoneNumber(phone: string): boolean {
  if (!isValidString(phone)) {
    return false;
  }
  const cleaned = phone.replace(/\s+/g, '').replace(/[-+()]/g, '');
  return /^[0-9]{10,15}$/.test(cleaned);
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

/**
 * Create a validator that combines multiple validators
 */
export function combineValidators(...validators: ((value: string) => boolean)[]): (value: string) => boolean {
  return (value: string) => validators.every((validator) => validator(value));
}

/**
 * Create a validator that checks if value matches one of validators
 */
export function anyValidator(...validators: ((value: string) => boolean)[]): (value: string) => boolean {
  return (value: string) => validators.some((validator) => validator(value));
}
