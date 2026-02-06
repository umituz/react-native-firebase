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

/**
 * Google Auth Service
 * Provides Google Sign-In functionality for Firebase
 */
export class GoogleAuthService {
  private config: GoogleAuthConfig | null = null;

  configure(config: GoogleAuthConfig): void {
    this.config = config;
  }

  isConfigured(): boolean {
    return (
      this.config !== null &&
      (!!this.config.webClientId ||
        !!this.config.iosClientId ||
        !!this.config.androidClientId)
    );
  }

  getConfig(): GoogleAuthConfig | null {
    return this.config;
  }

  async signInWithIdToken(
    auth: Auth,
    idToken: string,
  ): Promise<GoogleAuthResult> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
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
      if (__DEV__) {
        console.error('[Firebase Auth] Google Sign-In failed:', error);
      }
      return {
        success: false,
        error: error instanceof Error ? error.message : "Google sign-in failed",
      };
    }
  }
}

export const googleAuthService = new GoogleAuthService();
