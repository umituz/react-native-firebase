/**
 * Crypto Utilities
 * Shared cryptographic helpers for auth services
 */

import * as Crypto from "expo-crypto";

const NONCE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export async function generateNonce(length: number = 32): Promise<string> {
  const bytes = await Crypto.getRandomBytesAsync(length);
  return Array.from(bytes).map(b => NONCE_CHARS.charAt(b % NONCE_CHARS.length)).join("");
}

export async function hashNonce(nonce: string): Promise<string> {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);
}
