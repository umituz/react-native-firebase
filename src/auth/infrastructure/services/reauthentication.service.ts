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
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { generateNonce, hashNonce } from "./crypto.util";
import { executeOperation, failureResultFrom } from "../../../domain/utils";
import { isCancelledError } from "../../../domain/utils/error-handler.util";
import type {
  ReauthenticationResult,
  AuthProviderType,
  ReauthCredentialResult
} from "./reauthentication.types";

export type {
  ReauthenticationResult,
  AuthProviderType,
  ReauthCredentialResult
} from "./reauthentication.types";

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
    return failureResultFrom("auth/no-email", "User has no email");
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
    const err = error instanceof Error ? error : new Error(String(error));
    const errorInfo = {
      code: (err as { code?: string }).code ?? '',
      message: err.message
    };
    const code = isCancelledError(errorInfo) ? "auth/cancelled" : "auth/failed";
    return {
      success: false,
      error: { code, message: err.message }
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
