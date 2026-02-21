/**
 * ID Generator Utility
 * Centralized ID generation utilities for unique identifiers
 */

import * as Crypto from "expo-crypto";

/**
 * Generate a unique ID using timestamp and cryptographically secure random string
 * Format: timestamp-randomstring
 * @returns Unique identifier string
 */
export function generateUniqueId(): string {
  const randomBytes = Crypto.getRandomBytes(8);
  const hex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, "0")).join("");
  return `${Date.now()}-${hex}`;
}
