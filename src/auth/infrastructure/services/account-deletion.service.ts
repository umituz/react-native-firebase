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
  reauthenticateWithPassword,
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
   * Password for reauthentication (required if user signed in with email/password)
   * This must be provided by the calling code after prompting user for password
   */
  password?: string;
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
  if (__DEV__) {
    console.log("[deleteCurrentUser] Starting with options:", options);
  }

  const auth = getFirebaseAuth();

  if (!auth) {
    if (__DEV__) {
      console.log("[deleteCurrentUser] ❌ Firebase Auth not initialized");
    }
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
    if (__DEV__) {
      console.log("[deleteCurrentUser] ❌ No user signed in");
    }
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
    if (__DEV__) {
      console.log("[deleteCurrentUser] ❌ Cannot delete anonymous user");
    }
    return {
      success: false,
      error: {
        code: "auth/anonymous-user",
        message: "Cannot delete anonymous account",
        requiresReauth: false,
      },
    };
  }

  if (__DEV__) {
    const provider = getUserAuthProvider(user);
    console.log("[deleteCurrentUser] User info:", {
      uid: user.uid,
      provider,
      providerData: user.providerData?.map(p => p.providerId),
    });
  }

  // First attempt to delete
  try {
    if (__DEV__) {
      console.log("[deleteCurrentUser] Attempting to delete user...");
    }
    await deleteUser(user);
    if (__DEV__) {
      console.log("[deleteCurrentUser] ✅ User deleted successfully");
    }
    return { success: true };
  } catch (error) {
    const firebaseError = error as { code?: string; message?: string };
    const requiresReauth = firebaseError.code === "auth/requires-recent-login";

    if (__DEV__) {
      console.log("[deleteCurrentUser] First delete attempt failed:", {
        code: firebaseError.code,
        message: firebaseError.message,
        requiresReauth,
      });
    }

    // If reauthentication is required and autoReauthenticate is enabled
    if (requiresReauth && options.autoReauthenticate) {
      if (__DEV__) {
        console.log("[deleteCurrentUser] Attempting auto-reauthentication...");
      }
      const reauthResult = await attemptReauthenticationAndDelete(user, options);
      if (reauthResult) {
        if (__DEV__) {
          console.log("[deleteCurrentUser] Auto-reauth result:", reauthResult);
        }
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

  if (__DEV__) {
    console.log("[attemptReauthenticationAndDelete] Provider:", provider);
  }

  // Handle Apple reauthentication
  if (provider === "apple.com") {
    if (__DEV__) {
      console.log("[attemptReauthenticationAndDelete] Attempting Apple reauthentication...");
    }

    const reauthResult = await reauthenticateWithApple(user);

    if (__DEV__) {
      console.log("[attemptReauthenticationAndDelete] Apple reauth result:", reauthResult);
    }

    if (reauthResult.success) {
      // Retry deletion after successful reauthentication
      try {
        if (__DEV__) {
          console.log("[attemptReauthenticationAndDelete] Deleting user after Apple reauth...");
        }
        await deleteUser(user);
        if (__DEV__) {
          console.log("[attemptReauthenticationAndDelete] ✅ User deleted after Apple reauth");
        }
        return { success: true };
      } catch (deleteError) {
        const firebaseError = deleteError as { code?: string; message?: string };
        if (__DEV__) {
          console.log("[attemptReauthenticationAndDelete] ❌ Delete failed after Apple reauth:", firebaseError);
        }
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
      if (__DEV__) {
        console.log("[attemptReauthenticationAndDelete] ❌ Apple reauth failed");
      }
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

  // Handle Password reauthentication (requires password from caller)
  if (provider === "password") {
    if (__DEV__) {
      console.log("[attemptReauthenticationAndDelete] Password provider detected");
    }

    // For password, we need the caller to provide the password
    if (!options.password) {
      if (__DEV__) {
        console.log("[attemptReauthenticationAndDelete] No password provided, requesting reauth");
      }
      return {
        success: false,
        error: {
          code: "auth/password-reauth-required",
          message: "Please enter your password to delete your account",
          requiresReauth: true,
        },
      };
    }

    if (__DEV__) {
      console.log("[attemptReauthenticationAndDelete] Attempting password reauthentication...");
    }

    const reauthResult = await reauthenticateWithPassword(user, options.password);

    if (__DEV__) {
      console.log("[attemptReauthenticationAndDelete] Password reauth result:", reauthResult);
    }

    if (reauthResult.success) {
      try {
        if (__DEV__) {
          console.log("[attemptReauthenticationAndDelete] Deleting user after password reauth...");
        }
        await deleteUser(user);
        if (__DEV__) {
          console.log("[attemptReauthenticationAndDelete] ✅ User deleted after password reauth");
        }
        return { success: true };
      } catch (deleteError) {
        const firebaseError = deleteError as { code?: string; message?: string };
        if (__DEV__) {
          console.log("[attemptReauthenticationAndDelete] ❌ Delete failed after password reauth:", firebaseError);
        }
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
      if (__DEV__) {
        console.log("[attemptReauthenticationAndDelete] ❌ Password reauth failed");
      }
      return {
        success: false,
        error: {
          code: reauthResult.error?.code || "auth/reauthentication-failed",
          message: reauthResult.error?.message || "Password reauthentication failed",
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
