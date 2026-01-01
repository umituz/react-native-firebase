/**
 * Anonymous Auth Service
 * Service for managing anonymous/guest authentication
 */

import { signInAnonymously, type Auth, type User } from "firebase/auth";
import { toAnonymousUser, type AnonymousUser } from "../../domain/entities/AnonymousUser";
import { checkAuthState } from "./auth-utils.service";
import {
  trackPackageError,
  addPackageBreadcrumb,

declare const __DEV__: boolean;

export interface AnonymousAuthResult {
  readonly user: User;
  readonly anonymousUser: AnonymousUser;
  readonly wasAlreadySignedIn: boolean;
}

export interface AnonymousAuthServiceInterface {
  signInAnonymously(auth: Auth): Promise<AnonymousAuthResult>;
  getCurrentAnonymousUser(auth: Auth | null): User | null;
  isCurrentUserAnonymous(auth: Auth | null): boolean;
}

/**
 * Anonymous Auth Service
 * Handles anonymous authentication operations
 */
export class AnonymousAuthService implements AnonymousAuthServiceInterface {
  /**
   * Sign in anonymously
   * IMPORTANT: Only signs in if NO user exists (preserves email/password sessions)
   */
  async signInAnonymously(auth: Auth): Promise<AnonymousAuthResult> {
    if (!auth) {
      throw new Error("Firebase Auth instance is required");
    }

    const currentUser = auth.currentUser;

    // If user is already signed in with email/password, preserve that session
    if (currentUser && !currentUser.isAnonymous) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[AnonymousAuthService] User already signed in with email/password, skipping anonymous auth");
      }
      // Return a "fake" anonymous result to maintain API compatibility
      // The actual user is NOT anonymous
      return {
        user: currentUser,
        anonymousUser: toAnonymousUser(currentUser),
        wasAlreadySignedIn: true,
      };
    }

    // If already signed in anonymously, return existing user
    if (currentUser && currentUser.isAnonymous) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[AnonymousAuthService] User already signed in anonymously");
      }
      return {
        user: currentUser,
        anonymousUser: toAnonymousUser(currentUser),
        wasAlreadySignedIn: true,
      };
    }

    // No user exists, sign in anonymously
    addPackageBreadcrumb("firebase-auth", "Starting anonymous sign-in");

    try {
      const userCredential = await signInAnonymously(auth);
      const anonymousUser = toAnonymousUser(userCredential.user);

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.log("[AnonymousAuthService] Successfully signed in anonymously", { uid: anonymousUser.uid });
      }

      addPackageBreadcrumb("firebase-auth", "Anonymous sign-in successful", {
        userId: anonymousUser.uid,
      });

      return {
        user: userCredential.user,
        anonymousUser,
        wasAlreadySignedIn: false,
      };
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[AnonymousAuthService] Failed to sign in anonymously", error);
      }

      trackPackageError(
        error instanceof Error ? error : new Error("Anonymous sign-in failed"),
        {
          packageName: "firebase-auth",
          operation: "anonymous-sign-in",
        }
      );

      throw error;
    }
  }

  /**
   * Get current anonymous user
   */
  getCurrentAnonymousUser(auth: Auth | null): User | null {
    if (!auth) {
      return null;
    }

    try {
      const state = checkAuthState(auth);
      if (state.isAnonymous && state.currentUser) {
        return state.currentUser;
      }
      return null;
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[AnonymousAuthService] Error getting current anonymous user", error);
      }
      return null;
    }
  }

  /**
   * Check if current user is anonymous
   */
  isCurrentUserAnonymous(auth: Auth | null): boolean {
    if (!auth) {
      return false;
    }

    try {
      return checkAuthState(auth).isAnonymous;
    } catch (error) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        // eslint-disable-next-line no-console
        console.error("[AnonymousAuthService] Error checking if user is anonymous", error);
      }
      return false;
    }
  }
}

export const anonymousAuthService = new AnonymousAuthService();
