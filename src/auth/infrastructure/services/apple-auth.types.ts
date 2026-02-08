/**
 * Apple Auth Types
 * Type definitions for Apple authentication
 */

import type { UserCredential } from 'firebase/auth';

export interface AppleAuthConfig {
  clientId?: string;
  scope?: string;
  redirectURI?: string;
  state?: string;
}

export interface AppleAuthSuccessResult {
  success: true;
  userCredential: UserCredential;
  isNewUser: boolean;
}

export interface AppleAuthErrorResult {
  success: false;
  error: string;
  code?: string;
}

export type AppleAuthResult = AppleAuthSuccessResult | AppleAuthErrorResult;

export interface AppleAuthCredential {
  idToken: string;
  rawNonce: string;
}

export type User = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  isAnonymous: boolean;
};
