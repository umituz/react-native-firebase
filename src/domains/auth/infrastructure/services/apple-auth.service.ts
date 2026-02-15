/**
 * Apple Auth Service
 * Handles Apple Sign-In with Firebase Authentication
 * This service is optional and requires expo-apple-authentication to be installed
 */

import {
  OAuthProvider,
  signInWithCredential,
  type Auth,
} from "firebase/auth";
import { Platform } from "react-native";
import { generateNonce, hashNonce } from "./crypto.util";
import type { AppleAuthResult } from "./apple-auth.types";
import {
  isCancellationError,
} from "./base/base-auth.service";
import { executeAuthOperation, type Result } from "../../../../shared/domain/utils";
import { isNewUser as checkIsNewUser } from "../../domain/utils/user-metadata.util";
import { convertToOAuthResult } from "./utils/auth-result-converter.util";

// Conditional import - expo-apple-authentication is optional
let AppleAuthentication: any = null;
let isAppleAuthAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  AppleAuthentication = require("expo-apple-authentication");
  isAppleAuthAvailable = true;
} catch {
  // expo-apple-authentication not available - this is fine if not using Apple auth
  console.info("expo-apple-authentication is not installed. Apple authentication will not be available.");
}

export class AppleAuthService {
  async isAvailable(): Promise<boolean> {
    if (Platform.OS !== "ios") return false;
    if (!isAppleAuthAvailable || !AppleAuthentication?.isAvailableAsync) return false;
    try {
      return await AppleAuthentication.isAvailableAsync();
    } catch {
      return false;
    }
  }

  private convertToAppleAuthResult(result: Result<{ userCredential: any; isNewUser: boolean }>): AppleAuthResult {
    return convertToOAuthResult(result, "Apple sign-in failed");
  }

  async signIn(auth: Auth): Promise<AppleAuthResult> {
    if (!isAppleAuthAvailable) {
      return {
        success: false,
        error: "expo-apple-authentication is not available. Please install expo-apple-authentication.",
        code: "unavailable"
      };
    }

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

      // Check if user is new using shared utility
      const isNewUser = checkIsNewUser(userCredential);

      return {
        userCredential,
        isNewUser
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
