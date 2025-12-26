/**
 * Reauthentication Service
 * Handles Firebase Auth reauthentication for sensitive operations
 *
 * SOLID: Single Responsibility - Only handles reauthentication
 */

import {
  reauthenticateWithCredential,
  GoogleAuthProvider,
  OAuthProvider,
  EmailAuthProvider,
  type User,
  type AuthCredential,
} from "firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

export interface ReauthenticationResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export type AuthProviderType = "google.com" | "apple.com" | "password" | "anonymous" | "unknown";

/**
 * Get the primary auth provider for a user
 */
export function getUserAuthProvider(user: User): AuthProviderType {
  if (user.isAnonymous) {
    return "anonymous";
  }

  const providerData = user.providerData;
  if (!providerData || providerData.length === 0) {
    return "unknown";
  }

  // Check for Google
  const googleProvider = providerData.find((p) => p.providerId === "google.com");
  if (googleProvider) {
    return "google.com";
  }

  // Check for Apple
  const appleProvider = providerData.find((p) => p.providerId === "apple.com");
  if (appleProvider) {
    return "apple.com";
  }

  // Check for password
  const passwordProvider = providerData.find((p) => p.providerId === "password");
  if (passwordProvider) {
    return "password";
  }

  return "unknown";
}

/**
 * Reauthenticate with Google
 */
export async function reauthenticateWithGoogle(
  user: User,
  idToken: string
): Promise<ReauthenticationResult> {
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    await reauthenticateWithCredential(user, credential);
    return { success: true };
  } catch (error) {
    const firebaseError = error as { code?: string; message?: string };
    return {
      success: false,
      error: {
        code: firebaseError.code || "auth/reauthentication-failed",
        message: firebaseError.message || "Google reauthentication failed",
      },
    };
  }
}

/**
 * Reauthenticate with Email/Password
 */
export async function reauthenticateWithPassword(
  user: User,
  password: string
): Promise<ReauthenticationResult> {
  try {
    if (!user.email) {
      return {
        success: false,
        error: {
          code: "auth/no-email",
          message: "User has no email address",
        },
      };
    }

    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    return { success: true };
  } catch (error) {
    const firebaseError = error as { code?: string; message?: string };
    return {
      success: false,
      error: {
        code: firebaseError.code || "auth/reauthentication-failed",
        message: firebaseError.message || "Password reauthentication failed",
      },
    };
  }
}

/**
 * Generate a random nonce for Apple Sign-In security
 */
async function generateNonce(length: number = 32): Promise<string> {
  const randomBytes = await Crypto.getRandomBytesAsync(length);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < randomBytes.length; i++) {
    result += chars.charAt(randomBytes[i] % chars.length);
  }

  return result;
}

/**
 * Reauthenticate with Apple
 * Returns the credential that can be used for reauthentication
 */
export async function getAppleReauthCredential(): Promise<{
  success: boolean;
  credential?: AuthCredential;
  error?: { code: string; message: string };
}> {
  if (Platform.OS !== "ios") {
    return {
      success: false,
      error: {
        code: "auth/platform-not-supported",
        message: "Apple Sign-In is only available on iOS",
      },
    };
  }

  try {
    const isAvailable = await AppleAuthentication.isAvailableAsync();
    if (!isAvailable) {
      return {
        success: false,
        error: {
          code: "auth/apple-signin-unavailable",
          message: "Apple Sign-In is not available on this device",
        },
      };
    }

    // Generate nonce
    const nonce = await generateNonce();
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce
    );

    // Request Apple Sign-In
    const appleCredential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!appleCredential.identityToken) {
      return {
        success: false,
        error: {
          code: "auth/no-identity-token",
          message: "No identity token received from Apple",
        },
      };
    }

    // Create Firebase credential
    const provider = new OAuthProvider("apple.com");
    const credential = provider.credential({
      idToken: appleCredential.identityToken,
      rawNonce: nonce,
    });

    return { success: true, credential };
  } catch (error) {
    if (error instanceof Error && error.message.includes("ERR_CANCELED")) {
      return {
        success: false,
        error: {
          code: "auth/cancelled",
          message: "Apple Sign-In was cancelled",
        },
      };
    }

    return {
      success: false,
      error: {
        code: "auth/apple-reauthentication-failed",
        message: error instanceof Error ? error.message : "Apple reauthentication failed",
      },
    };
  }
}

/**
 * Reauthenticate with Apple
 */
export async function reauthenticateWithApple(user: User): Promise<ReauthenticationResult> {
  const result = await getAppleReauthCredential();
  
  if (!result.success || !result.credential) {
    return {
      success: false,
      error: result.error || {
        code: "auth/no-credential",
        message: "Failed to get Apple credential",
      },
    };
  }

  try {
    await reauthenticateWithCredential(user, result.credential);
    return { success: true };
  } catch (error) {
    const firebaseError = error as { code?: string; message?: string };
    return {
      success: false,
      error: {
        code: firebaseError.code || "auth/reauthentication-failed",
        message: firebaseError.message || "Apple reauthentication failed",
      },
    };
  }
}
