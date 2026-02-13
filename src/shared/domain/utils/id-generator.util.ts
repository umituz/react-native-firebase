/**
 * ID Generator Utility
 * Centralized ID generation utilities for unique identifiers
 */

/**
 * Generate a unique ID using timestamp and random string
 * Format: timestamp-randomstring
 * @returns Unique identifier string
 */
export function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Generate a short random ID
 * Useful for temporary identifiers where uniqueness within scope is sufficient
 * @returns Random identifier string
 */
export function generateShortId(length: number = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate a UUID-like ID
 * Format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
 * @returns UUID-like identifier string
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a nanoid-like ID
 * Uses URL-safe characters for better compatibility
 * @param length - Length of the ID (default: 21)
 * @returns URL-safe unique identifier string
 */
export function generateNanoId(length: number = 21): string {
  const chars = 'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
