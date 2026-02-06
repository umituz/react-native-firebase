/**
 * Apple Auth Service
 * Handles Apple Sign-In with Firebase Authentication
 */

import {
  OAuthProvider,
  signInWithCredential,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
import { generateNonce, hashNonce } from "./crypto.util";

export interface AppleAuthResult {
  success: boolean;
  userCredential?: UserCredential;
  error?: string;
  isNewUser?: boolean;
}

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
        return { success: false, error: "No identity token received" };
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
        return { success: false, error: "Apple Sign-In was cancelled" };
      }
      if (__DEV__) console.error('[Firebase Auth] Apple Sign-In failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Apple sign-in failed",
      };
    }
  }

}

export const appleAuthService = new AppleAuthService();
