/**
 * Reauthentication Types
 * Type definitions for reauthentication operations
 */

import type { AuthCredential } from 'firebase/auth';

export interface ReauthenticationCredential {
  provider: 'password' | 'google.com' | 'apple.com';
  credential: AuthCredential;
}

export interface ReauthenticationResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export type AuthProviderType = 'anonymous' | 'password' | 'google.com' | 'apple.com' | 'unknown';

export interface ReauthCredentialResult {
  success: boolean;
  credential?: AuthCredential;
  error?: {
    code: string;
    message: string;
  };
}

export interface AccountDeletionResult {
  success: boolean;
  error?: {
    code?: string;
    message?: string;
    requiresReauth?: boolean;
  };
}

export interface AccountDeletionOptions {
  reauthenticate?: boolean;
  autoReauthenticate?: boolean;
  password?: string;
  googleIdToken?: string;
}
