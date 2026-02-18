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
