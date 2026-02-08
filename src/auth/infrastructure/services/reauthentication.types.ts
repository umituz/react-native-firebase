/**
 * Reauthentication Types
 * Type definitions for reauthentication operations
 */

export interface ReauthenticationCredential {
  provider: 'password' | 'google.com' | 'apple.com';
  credential: unknown;
}

export interface ReauthenticationResult {
  success: boolean;
  error?: {
    code?: string;
    message?: string;
  };
}

export type AuthProviderType = 'password' | 'google.com' | 'apple.com';

export interface ReauthCredentialResult {
  success: boolean;
  credential?: ReauthenticationCredential;
  error?: string;
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
