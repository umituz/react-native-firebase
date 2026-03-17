/**
 * Crypto Utilities
 * Shared cryptographic helpers for auth services
 */

import * as Crypto from "expo-crypto";

const NONCE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export async function generateNonce(length: number = 32): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(length);
  const charsLength = NONCE_CHARS.length;
  const result: string[] = [];

  // Optimized: Single pass with direct character access
  for (let i = 0; i < length; i++) {
    const charIndex = bytes[i]! % charsLength; // Non-null assertion: index is always valid
    result.push(NONCE_CHARS[charIndex]!); // Non-null assertion: charIndex is always within bounds
  }

  return result.join('');
}

export async function hashNonce(nonce: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
}
