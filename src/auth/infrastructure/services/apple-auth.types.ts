/**
 * Apple Auth Types
 * Type definitions for Apple authentication
 */

export interface AppleAuthResult {
  success: boolean;
  user: User;
  credential: AppleAuthCredential;
  wasAlreadySignedIn: boolean;
  error?: string;
}

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
