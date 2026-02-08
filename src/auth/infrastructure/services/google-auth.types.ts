/**
 * Google Auth Types
 * Type definitions for Google authentication
 */

export interface GoogleAuthConfig {
  clientId?: string;
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
}

export interface GoogleAuthResult {
  success: boolean;
  user: User;
  credential: GoogleAuthCredential;
  wasAlreadySignedIn: boolean;
}

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
