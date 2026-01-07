/**
 * Reauthentication Types
 */

import type { AuthCredential } from "firebase/auth";

export interface ReauthenticationResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export type AuthProviderType = "google.com" | "apple.com" | "password" | "anonymous" | "unknown";

export interface ReauthCredentialResult {
  success: boolean;
  credential?: AuthCredential;
  error?: { code: string; message: string };
}

export interface AccountDeletionResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
    requiresReauth: boolean;
  };
}

export interface AccountDeletionOptions {
  /** Google ID token for reauthentication */
  googleIdToken?: string;
  /** Password for reauthentication */
  password?: string;
  /** Attempt Apple reauth automatically */
  autoReauthenticate?: boolean;
}
