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
  isCancellationError,
} from "./base/base-auth.service";
import { executeAuthOperation, type Result } from "../../../domain/utils";

export class AppleAuthService {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== "ios") return false;
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }

  private convertToAppleAuthResult(result: Result<{ userCredential: any; isNewUser: boolean }>): AppleAuthResult {
    if (result.success && result.data) {
      return {
        success: true,
        userCredential: result.data.userCredential,
        isNewUser: result.data.isNewUser,
      };
    }
    return {
      success: false,
      error: result.error?.message ?? "Apple sign-in failed",
      code: result.error?.code,
    };
  }

  async signIn(auth: Auth): Promise<AppleAuthResult> {
    const isAvailable = await this.isAvailable();
    if (!isAvailable) {
      return {
        success: false,
        error: "Apple Sign-In is not available on this device",
        code: "unavailable"
      };
    }

    const result = await executeAuthOperation(async () => {
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
        throw new Error("No identity token received");
      }

      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
        rawNonce: nonce,
      });

      const userCredential = await signInWithCredential(auth, credential);
      return {
        userCredential,
        isNewUser: userCredential.user.metadata.creationTime ===
          userCredential.user.metadata.lastSignInTime
      };
    });

    return this.convertToAppleAuthResult(result);
  }

  /**
   * Sign in with error handling for cancellation
   */
  async signInWithCancellationHandling(auth: Auth): Promise<AppleAuthResult> {
    try {
      return await this.signIn(auth);
    } catch (error) {
      if (isCancellationError(error)) {
        return {
          success: false,
          error: "Apple Sign-In was cancelled",
          code: "canceled"
        };
      }

      // Re-throw for executeAuthOperation to handle
      throw error;
    }
  }

}

export const appleAuthService = new AppleAuthService();
