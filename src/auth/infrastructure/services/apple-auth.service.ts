/**
 * Apple Auth Service
 * Handles Apple Sign-In with Firebase Authentication
 * Uses expo-apple-authentication for native Apple Sign-In
 */

import {
  OAuthProvider,
  signInWithCredential,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { Platform } from "react-native";

/**
 * Apple Auth result
 */
export interface AppleAuthResult {
  success: boolean;
  userCredential?: UserCredential;
  error?: string;
  isNewUser?: boolean;
}

/**
 * Apple Auth Service
 * Provides Apple Sign-In functionality for Firebase (iOS only)
 */
export class AppleAuthService {
  /**
   * Check if Apple Sign-In is available
   * Only available on iOS 13+
   */
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== "ios") {
      return false;
    }

    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }

  /**
   * Sign in with Apple
   * Handles the complete Apple Sign-In flow
   */
  async signIn(auth: Auth): Promise<AppleAuthResult> {
    try {
      // Check availability
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: "Apple Sign-In is not available on this device",
        };
      }

      // Generate nonce for security
      const nonce = await this.generateNonce();
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        nonce,
      );

      // Request Apple Sign-In
      const appleCredential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      // Check for identity token
      if (!appleCredential.identityToken) {
        return {
          success: false,
          error: "No identity token received from Apple",
        };
      }

      // Create Firebase credential
      const provider = new OAuthProvider("apple.com");
      const credential = provider.credential({
        idToken: appleCredential.identityToken,
        rawNonce: nonce,
      });

      // Sign in to Firebase
      const userCredential = await signInWithCredential(auth, credential);

      // Check if this is a new user
      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime;

      return {
        success: true,
        userCredential,
        isNewUser,
      };
    } catch (error) {
      // Handle user cancellation
      if (
        error instanceof Error &&
        error.message.includes("ERR_CANCELED")
      ) {
        return {
          success: false,
          error: "Apple Sign-In was cancelled",
        };
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Apple sign-in failed",
      };
    }
  }

  /**
   * Generate a random nonce for Apple Sign-In security
   */
  private async generateNonce(length: number = 32): Promise<string> {
    const randomBytes = await Crypto.getRandomBytesAsync(length);
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < randomBytes.length; i++) {
      result += chars.charAt(randomBytes[i] % chars.length);
    }

    return result;
  }
}

/**
 * Singleton instance
 */
export const appleAuthService = new AppleAuthService();
