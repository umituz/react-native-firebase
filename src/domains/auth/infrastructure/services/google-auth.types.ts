/**
 * Google Auth Types
 * Type definitions for Google authentication
 */

import type { UserCredential } from 'firebase/auth';

export interface GoogleAuthConfig {
  clientId?: string;
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
}

export interface GoogleAuthSuccessResult {
  success: true;
  userCredential: UserCredential;
  isNewUser: boolean;
}

export interface GoogleAuthErrorResult {
  success: false;
  error: string;
  code?: string;
}

export type GoogleAuthResult = GoogleAuthSuccessResult | GoogleAuthErrorResult;

export interface GoogleAuthCredential {
  idToken: string;
  accessToken?: string;
}

export type User = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  isAnonymous: boolean;
  photoURL?: string | null;
};
