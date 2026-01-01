/**
 * Google Auth Service
 * Handles Google Sign-In with Firebase Authentication
 * Uses expo-auth-session for OAuth flow
 */

import {
  GoogleAuthProvider,
  signInWithCredential,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import {
  trackPackageError,
  addPackageBreadcrumb,

/**
 * Google Auth configuration
 */
export interface GoogleAuthConfig {
  webClientId?: string;
  iosClientId?: string;
  androidClientId?: string;
}

/**
 * Google Auth result
 */
export interface GoogleAuthResult {
  success: boolean;
  userCredential?: UserCredential;
  error?: string;
  isNewUser?: boolean;
}

/**
 * Google Auth Service
 * Provides Google Sign-In functionality for Firebase
 */
export class GoogleAuthService {
  private config: GoogleAuthConfig | null = null;

  /**
   * Configure Google Auth with client IDs
   */
  configure(config: GoogleAuthConfig): void {
    this.config = config;
  }

  /**
   * Check if Google Auth is configured
   */
  isConfigured(): boolean {
    return (
      this.config !== null &&
      (!!this.config.webClientId ||
        !!this.config.iosClientId ||
        !!this.config.androidClientId)
    );
  }

  /**
   * Get the current configuration
   */
  getConfig(): GoogleAuthConfig | null {
    return this.config;
  }

  /**
   * Sign in with Google ID token
   * Called after successful Google OAuth flow
   */
  async signInWithIdToken(
    auth: Auth,
    idToken: string,
  ): Promise<GoogleAuthResult> {
    addPackageBreadcrumb("firebase-auth", "Google Sign-In with ID token");

    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      // Check if this is a new user
      const isNewUser =
        userCredential.user.metadata.creationTime ===
        userCredential.user.metadata.lastSignInTime;

      addPackageBreadcrumb("firebase-auth", "Google Sign-In successful", {
        isNewUser,
        userId: userCredential.user.uid,
      });

      return {
        success: true,
        userCredential,
        isNewUser,
      };
    } catch (error) {
      trackPackageError(
        error instanceof Error ? error : new Error("Google sign-in failed"),
        {
          packageName: "firebase-auth",
          operation: "google-sign-in",
        }
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : "Google sign-in failed",
      };
    }
  }
}

/**
 * Singleton instance
 */
export const googleAuthService = new GoogleAuthService();
