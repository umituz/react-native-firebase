/**
 * Apple Auth Service
 * Handles Apple Sign-In with Firebase Authentication
 */

import {
  OAuthProvider,
  signInWithCredential,
  type Auth,
} from "firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { generateNonce, hashNonce } from "./crypto.util";
import type { AppleAuthResult } from "./apple-auth.types";
import {
  createSuccessResult,
  createFailureResult,
  isCancellationError,
} from "./base/base-auth.service";

export class AppleAuthService {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== "ios") return false;
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }

  async signIn(auth: Auth): Promise<AppleAuthResult> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: "Apple Sign-In is not available on this device",
          code: "unavailable"
        };
      }

      const nonce = await generateNonce();
      const hashedNonce = await hashNonce(nonce);

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
          error: "No identity token received",
          code: "no_token"
        };
      }

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
        rawNonce: nonce,
      });

      const userCredential = await signInWithCredential(auth, credential);
      return createSuccessResult(userCredential);
    } catch (error) {
      if (isCancellationError(error)) {
        return {
          success: false,
          error: "Apple Sign-In was cancelled",
          code: "canceled"
        };
      }

      return createFailureResult(error);
    }
  }

}

export const appleAuthService = new AppleAuthService();
