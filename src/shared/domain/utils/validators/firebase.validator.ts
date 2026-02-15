/**
 * Firebase-Specific Validators
 * Validation utilities for Firebase configuration
 */

import { isValidString } from './string.validator';

/**
 * Validate Firebase API key format
 * Firebase API keys typically start with "AIza" followed by 35 characters
 */
export function isValidFirebaseApiKey(apiKey: string): boolean {
  if (!isValidString(apiKey)) {
    return false;
  }
  const apiKeyPattern = /^AIza[0-9A-Za-z_-]{35}$/;
  return apiKeyPattern.test(apiKey);
}

/**
 * Validate Firebase authDomain format
 * Expected format: "projectId.firebaseapp.com" or "projectId.web.app"
 */
export function isValidFirebaseAuthDomain(authDomain: string): boolean {
  if (!isValidString(authDomain)) {
    return false;
  }
  return (
    authDomain.includes('.firebaseapp.com') ||
    authDomain.includes('.web.app')
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
  return pattern.test(projectId);
}
