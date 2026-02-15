/**
 * User Input Validators
 * Validation utilities for user input (email, password, username, phone)
 */

import { isValidString } from './string.validator';

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!isValidString(email)) {
    return false;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
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
