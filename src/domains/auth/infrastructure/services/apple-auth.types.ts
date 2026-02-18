/**
 * Apple Auth Types
 * Type definitions for Apple authentication
 */

import type { UserCredential } from 'firebase/auth';

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
