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

