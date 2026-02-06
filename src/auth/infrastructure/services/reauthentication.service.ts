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

function toAuthError(error: unknown): { code: string; message: string } {
  const err = error as { code?: string; message?: string };
  return {
    code: err.code || "auth/failed",
    message: err.message || "Unknown error",
  };
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
  try {
    await reauthenticateWithCredential(user, GoogleAuthProvider.credential(idToken));
    return { success: true };
  } catch (error: unknown) {
    const err = toAuthError(error);
    return { success: false, error: err };
  }
}

export async function reauthenticateWithPassword(user: User, pass: string): Promise<ReauthenticationResult> {
  if (!user.email) return { success: false, error: { code: "auth/no-email", message: "User has no email" } };
  try {
    await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, pass));
    return { success: true };
  } catch (error: unknown) {
    const err = toAuthError(error);
    return { success: false, error: err };
  }
}

export async function getAppleReauthCredential(): Promise<ReauthCredentialResult> {
  if (Platform.OS !== "ios") return { success: false, error: { code: "auth/ios-only", message: "iOS only" } };
  try {
    if (!(await AppleAuthentication.isAvailableAsync())) 
      return { success: false, error: { code: "auth/unavailable", message: "Unavailable" } };

    const nonce = await generateNonce();
    const hashed = await hashNonce(nonce);
    const apple = await AppleAuthentication.signInAsync({
      requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      nonce: hashed,
    });

    if (!apple.identityToken) return { success: false, error: { code: "auth/no-token", message: "No token" } };
    return { success: true, credential: new OAuthProvider("apple.com").credential({ idToken: apple.identityToken, rawNonce: nonce }) };
  } catch (error: unknown) {
    const err = toAuthError(error);
    const code = err.message.includes("ERR_CANCELED") ? "auth/cancelled" : err.code;
    return { success: false, error: { code, message: err.message } };
  }
}

export async function reauthenticateWithApple(user: User): Promise<ReauthenticationResult> {
  const res = await getAppleReauthCredential();
  if (!res.success || !res.credential) return { success: false, error: res.error };
  try {
    await reauthenticateWithCredential(user, res.credential);
    return { success: true };
  } catch (error: unknown) {
    const err = toAuthError(error);
    return { success: false, error: err };
  }
}
