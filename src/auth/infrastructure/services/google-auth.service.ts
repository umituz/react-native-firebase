/**
 * Google Auth Service
 * Handles Google Sign-In with Firebase Authentication
 */

import {
  GoogleAuthProvider,
  signInWithCredential,
  type Auth,
} from "firebase/auth";
import type { GoogleAuthConfig, GoogleAuthResult } from "./google-auth.types";
import { executeAuthOperation, type Result } from "../../../domain/utils";
import { ConfigurableService } from "../../../domain/utils/service-config.util";

/**
 * Google Auth Service
 * Provides Google Sign-In functionality for Firebase
 */
export class GoogleAuthService extends ConfigurableService<GoogleAuthConfig> {
  protected isValidConfig(config: GoogleAuthConfig): boolean {
    return (
      config !== null &&
      (!!config.webClientId || !!config.iosClientId || !!config.androidClientId)
    );
  }

  private convertToGoogleAuthResult(result: Result<{ userCredential: any; isNewUser: boolean }>): GoogleAuthResult {
    if (result.success && result.data) {
      return {
        success: true,
        userCredential: result.data.userCredential,
        isNewUser: result.data.isNewUser,
      };
    }
    return {
      success: false,
      error: result.error?.message ?? "Google sign-in failed",
      code: result.error?.code,
    };
  }

  async signInWithIdToken(
    auth: Auth,
    idToken: string,
  ): Promise<GoogleAuthResult> {
    const result = await executeAuthOperation(async () => {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      return {
        userCredential,
        isNewUser: userCredential.user.metadata.creationTime ===
          userCredential.user.metadata.lastSignInTime
      };
    });
    return this.convertToGoogleAuthResult(result);
  }
}

export const googleAuthService = new GoogleAuthService();
