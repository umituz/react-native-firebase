/**
 * URL Validators
 * Validation utilities for URLs
 */

import { isValidString } from './string.validator';

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
