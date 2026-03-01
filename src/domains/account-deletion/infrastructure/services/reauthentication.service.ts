/**
 * Reauthentication Service
 * Handles Firebase Auth reauthentication for sensitive operations
 */

import {
  reauthenticateWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  EmailAuthProvider,
  type User,
} from "firebase/auth";
import { Platform } from "react-native";

/**
 * Lazy-loads expo-apple-authentication (optional peer dependency).
 * Returns null if the package is not installed.
 */
function getAppleAuthModule(): typeof import("expo-apple-authentication") | null {
  try {
    // Dynamic require needed for optional peer dependency
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-apple-authentication");
  } catch {
    return null;
  }
}
import { generateNonce, hashNonce } from "../../../auth/infrastructure/services/crypto.util";
import { executeOperation, failureResultFrom, toErrorInfo, ERROR_MESSAGES } from "../../../../shared/domain/utils";
import { isCancelledError } from "../../../../shared/domain/utils/error-handlers/error-checkers";
import type {
  ReauthenticationResult,
  AuthProviderType,
  ReauthCredentialResult
} from "../../application/ports/reauthentication.types";

/**
 * Validates email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates password (Firebase minimum is 6 characters)
 */
function isValidPassword(password: string): boolean {
  return password.length >= 6;
}

export function getUserAuthProvider(user: User): AuthProviderType {
  if (user.isAnonymous) return "anonymous";
  const data = user.providerData;
  if (!data?.length) return "unknown";
  if (data.find(p => p.providerId === "google.com")) return "google.com";
  if (data.find(p => p.providerId === "apple.com")) return "apple.com";
  if (data.find(p => p.providerId === "password")) return "password";
  return "unknown";
}

export async function reauthenticateWithGoogle(user: User, idToken: string): Promise<ReauthenticationResult> {
  return executeOperation(async () => {
    await reauthenticateWithCredential(user, GoogleAuthProvider.credential(idToken));
  });
}

export async function reauthenticateWithPassword(user: User, pass: string): Promise<ReauthenticationResult> {
  const email = user.email;
  if (!email) {
    return failureResultFrom("auth/no-email", ERROR_MESSAGES.AUTH.NO_USER);
  }

  // FIX: Add email validation
  if (!isValidEmail(email)) {
    return failureResultFrom("auth/invalid-email", ERROR_MESSAGES.AUTH.INVALID_EMAIL);
  }

  // FIX: Add password validation
  if (!isValidPassword(pass)) {
    return failureResultFrom("auth/invalid-password", ERROR_MESSAGES.AUTH.INVALID_PASSWORD);
  }

  return executeOperation(async () => {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(email, pass));
  });
}

export async function getAppleReauthCredential(): Promise<ReauthCredentialResult> {
  if (Platform.OS !== "ios") {
    return {
      success: false,
      error: { code: "auth/ios-only", message: "iOS only" }
    };
  }

  const AppleAuthentication = getAppleAuthModule();
  if (!AppleAuthentication) {
    return {
      success: false,
      error: { code: "auth/unavailable", message: "expo-apple-authentication is not installed" }
    };
  }

  try {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: { code: "auth/unavailable", message: "Unavailable" }
      };
    }

    const nonce = await generateNonce();
    const hashed = await hashNonce(nonce);
    const apple = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL
      ],
      nonce: hashed,
    });

    if (!apple.identityToken) {
      return {
        success: false,
        error: { code: "auth/no-token", message: "No token" }
      };
    }

    const credential = new OAuthProvider("apple.com").credential({
      idToken: apple.identityToken,
      rawNonce: nonce
    });

    return {
      success: true,
      credential
    };
  } catch (error: unknown) {
    const errorInfo = toErrorInfo(error, 'auth/failed');
    const code = isCancelledError(errorInfo) ? "auth/cancelled" : errorInfo.code;
    return {
      success: false,
      error: { code, message: errorInfo.message }
    };
  }
}

export async function reauthenticateWithApple(user: User): Promise<ReauthenticationResult> {
  const res = await getAppleReauthCredential();
  if (!res.success || !res.credential) {
    return { success: false, error: res.error ?? { code: "auth/failed", message: "Failed to get credential" } };
  }

  const credential = res.credential;
  return executeOperation(async () => {
    await reauthenticateWithCredential(user, credential);
  });
}
