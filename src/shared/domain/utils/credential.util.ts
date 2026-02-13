/**
 * Credential Utility
 * Centralized credential generation for authentication providers
 * Eliminates code duplication across auth services
 */

import {
  GoogleAuthProvider,
  OAuthProvider,
  type AuthCredential,
} from 'firebase/auth';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import { generateNonce, hashNonce } from '../../../domains/auth/infrastructure/services/crypto.util';

/**
 * Generate Google credential from ID token
 */
export function generateGoogleCredential(idToken: string): AuthCredential {
  return GoogleAuthProvider.credential(idToken);
}

/**
 * Generate Apple credential from identity token and nonce
 */
export function generateAppleCredential(
  identityToken: string,
  rawNonce: string
): AuthCredential {
  const provider = new OAuthProvider('apple.com');
  return provider.credential({
    idToken: identityToken,
    rawNonce,
  });
}

/**
 * Check if Apple Sign-In is available
 */
export async function isAppleSignInAvailable(): Promise<boolean> {
  if (Platform.OS !== 'ios') {
    return false;
  }
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch {
    return false;
  }
}

/**
 * Perform Apple Sign-In with default scopes
 */
export async function performAppleSignIn(): Promise<{
  identityToken: string | null;
  nonce: string;
  rawNonce: string;
}> {
  const rawNonce = await generateNonce();
  const hashedNonce = await hashNonce(rawNonce);

  const result = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  return {
    identityToken: result.identityToken,
    nonce: hashedNonce,
    rawNonce,
  };
}

/**
 * Email/Password credential interface
 */
export interface EmailPasswordCredential {
  email: string;
  password: string;
}

/**
 * Validate email/password credential
 */
export function isValidEmailPassword(credential: EmailPasswordCredential): boolean {
  return (
    typeof credential.email === 'string' &&
    credential.email.length > 0 &&
    typeof credential.password === 'string' &&
    credential.password.length > 0
  );
}

/**
 * Custom credential generator interface
 */
export interface CredentialGenerator {
  generate(): AuthCredential | Promise<AuthCredential>;
}
