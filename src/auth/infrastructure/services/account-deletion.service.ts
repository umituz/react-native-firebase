/**
 * Account Deletion Service
 * Handles Firebase Auth account deletion operations with automatic reauthentication
 *
 * SOLID: Single Responsibility - Only handles account deletion
 */

import { deleteUser, type User } from "firebase/auth";
import { getFirebaseAuth } from "../config/FirebaseAuthClient";
import {
  getUserAuthProvider,
  reauthenticateWithApple,
} from "./reauthentication.service";

export interface AccountDeletionResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
    requiresReauth: boolean;
  };
}

export interface AccountDeletionOptions {
  /**
   * Google ID token for reauthentication (required if user signed in with Google)
   * This must be provided by the calling code after prompting user for Google sign-in
   */
  googleIdToken?: string;
  /**
   * If true, will attempt to reauthenticate with Apple automatically
   * (shows Apple sign-in prompt to user)
   */
  autoReauthenticate?: boolean;
}

/**
 * Delete the current user's Firebase Auth account
 * Now with automatic reauthentication support for Apple Sign-In
 * Note: This is irreversible and also signs out the user
 */
export async function deleteCurrentUser(
  options: AccountDeletionOptions = { autoReauthenticate: true }
): Promise<AccountDeletionResult> {
  const auth = getFirebaseAuth();

  if (!auth) {
    return {
      success: false,
      error: {
        code: "auth/not-initialized",
        message: "Firebase Auth is not initialized",
        requiresReauth: false,
      },
    };
  }

  const user = auth.currentUser;

  if (!user) {
    return {
      success: false,
      error: {
        code: "auth/no-user",
        message: "No user is currently signed in",
        requiresReauth: false,
      },
    };
  }

  if (user.isAnonymous) {
    return {
      success: false,
      error: {
        code: "auth/anonymous-user",
        message: "Cannot delete anonymous account",
        requiresReauth: false,
      },
    };
  }

  // First attempt to delete
  try {
    await deleteUser(user);
    return { success: true };
  } catch (error) {
    const firebaseError = error as { code?: string; message?: string };
    const requiresReauth = firebaseError.code === "auth/requires-recent-login";

    // If reauthentication is required and autoReauthenticate is enabled
    if (requiresReauth && options.autoReauthenticate) {
      const reauthResult = await attemptReauthenticationAndDelete(user, options);
      if (reauthResult) {
        return reauthResult;
      }
    }

    return {
      success: false,
      error: {
        code: firebaseError.code || "auth/unknown",
        message: requiresReauth
          ? "Please sign in again before deleting your account"
          : firebaseError.message || "Failed to delete account",
        requiresReauth,
      },
    };
  }
}

/**
 * Attempt to reauthenticate based on provider and then delete the account
 */
async function attemptReauthenticationAndDelete(
  user: User,
  options: AccountDeletionOptions
): Promise<AccountDeletionResult | null> {
  const provider = getUserAuthProvider(user);

  // Handle Apple reauthentication
  if (provider === "apple.com") {
    const reauthResult = await reauthenticateWithApple(user);

    if (reauthResult.success) {
      // Retry deletion after successful reauthentication
      try {
        await deleteUser(user);
        return { success: true };
      } catch (deleteError) {
        const firebaseError = deleteError as { code?: string; message?: string };
        return {
          success: false,
          error: {
            code: firebaseError.code || "auth/deletion-failed-after-reauth",
            message: firebaseError.message || "Failed to delete account after reauthentication",
            requiresReauth: false,
          },
        };
      }
    } else {
      // Reauthentication failed
      return {
        success: false,
        error: {
          code: reauthResult.error?.code || "auth/reauthentication-failed",
          message: reauthResult.error?.message || "Reauthentication failed",
          requiresReauth: true,
        },
      };
    }
  }

  // Handle Google reauthentication (requires ID token from caller)
  if (provider === "google.com") {
    // For Google, we need the caller to provide the ID token
    // This is because we need to trigger Google Sign-In UI which must be done at the presentation layer
    if (!options.googleIdToken) {
      return {
        success: false,
        error: {
          code: "auth/google-reauth-required",
          message: "Please sign in with Google again to delete your account",
          requiresReauth: true,
        },
      };
    }

    // If we have a Google ID token, reauthenticate with it
    const { reauthenticateWithGoogle } = await import("./reauthentication.service");
    const reauthResult = await reauthenticateWithGoogle(user, options.googleIdToken);

    if (reauthResult.success) {
      try {
        await deleteUser(user);
        return { success: true };
      } catch (deleteError) {
        const firebaseError = deleteError as { code?: string; message?: string };
        return {
          success: false,
          error: {
            code: firebaseError.code || "auth/deletion-failed-after-reauth",
            message: firebaseError.message || "Failed to delete account after reauthentication",
            requiresReauth: false,
          },
        };
      }
    } else {
      return {
        success: false,
        error: {
          code: reauthResult.error?.code || "auth/reauthentication-failed",
          message: reauthResult.error?.message || "Google reauthentication failed",
          requiresReauth: true,
        },
      };
    }
  }

  // For other providers, return null to use the default error handling
  return null;
}

/**
 * Delete a specific user (must be the current user)
 */
export async function deleteUserAccount(
  user: User
): Promise<AccountDeletionResult> {
  if (!user) {
    return {
      success: false,
      error: {
        code: "auth/no-user",
        message: "No user provided",
        requiresReauth: false,
      },
    };
  }

  if (user.isAnonymous) {
    return {
      success: false,
      error: {
        code: "auth/anonymous-user",
        message: "Cannot delete anonymous account",
        requiresReauth: false,
      },
    };
  }

  try {
    await deleteUser(user);
    return { success: true };
  } catch (error) {
    const firebaseError = error as { code?: string; message?: string };
    const requiresReauth = firebaseError.code === "auth/requires-recent-login";

    return {
      success: false,
      error: {
        code: firebaseError.code || "auth/unknown",
        message: requiresReauth
          ? "Please sign in again before deleting your account"
          : firebaseError.message || "Failed to delete account",
        requiresReauth,
      },
    };
  }
}
