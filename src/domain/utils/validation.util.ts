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
