/**
 * Google Auth Types
 */

import type { UserCredential } from "firebase/auth";

/**
 * Google Auth configuration
 */
export interface GoogleAuthConfig {
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
}

/**
 * Google Auth result
 */
export interface GoogleAuthResult {
  success: boolean;
  userCredential?: UserCredential;
  error?: string;
  isNewUser?: boolean;
}
