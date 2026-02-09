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
import {
  createSuccessResult,
  createFailureResult,
  logAuthError,
} from "./base/base-auth.service";

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
      return createSuccessResult(userCredential);
    } catch (error) {
      logAuthError('Google Sign-In', error);
      return createFailureResult(error);
    }
  }
}

export const googleAuthService = new GoogleAuthService();
