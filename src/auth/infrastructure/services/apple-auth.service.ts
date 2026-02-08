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

export class AppleAuthService {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== "ios") return false;
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch (error) {
      if (__DEV__) console.warn('[AppleAuth] isAvailable check failed:', error);
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
          code: "unavailable",
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
      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime;

      return {
        success: true,
        userCredential,
        isNewUser,
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes("ERR_CANCELED")) {
        return {
          success: false,
          error: "Apple Sign-In was cancelled",
          code: "canceled"
        };
      }

      if (__DEV__) console.error('[Firebase Auth] Apple Sign-In failed:', error);

      const errorCode = (error as { code?: string })?.code || 'unknown';
      const errorMessage = error instanceof Error ? error.message : 'Apple sign-in failed';

      return {
        success: false,
        error: errorMessage,
        code: errorCode,
      };
    }
  }

}

export const appleAuthService = new AppleAuthService();
