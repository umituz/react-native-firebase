/**
 * Account Deletion Service
 * Handles Firebase account deletion with reauthentication support
 */

import { deleteUser, type User } from "firebase/auth";

declare const __DEV__: boolean;
import { getFirebaseAuth } from "../../../auth/infrastructure/config/FirebaseAuthClient";
import {
  getUserAuthProvider,
  reauthenticateWithApple,
  reauthenticateWithPassword,
  reauthenticateWithGoogle,
} from "./reauthentication.service";
import { successResult, type Result, toAuthErrorInfo } from "../../../../shared/domain/utils";
import type { AccountDeletionOptions } from "../../application/ports/reauthentication.types";

export interface AccountDeletionResult extends Result<void> {
  requiresReauth?: boolean;
}

export type { AccountDeletionOptions } from "../../application/ports/reauthentication.types";

// Operation lock to prevent concurrent deletion attempts
let deletionInProgress = false;

export async function deleteCurrentUser(
  options: AccountDeletionOptions = { autoReauthenticate: true }
): Promise<AccountDeletionResult> {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[deleteCurrentUser] Called with options:", options);
  }

  // FIX: Check if deletion already in progress
  if (deletionInProgress) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[deleteCurrentUser] Deletion already in progress");
    }
    return {
      success: false,
      error: { code: "auth/operation-in-progress", message: "Account deletion already in progress" },
      requiresReauth: false
    };
  }

  deletionInProgress = true;

  try {
    const auth = getFirebaseAuth();
    const user = auth?.currentUser;

    if (!auth || !user) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[deleteCurrentUser] Auth not ready");
      }
      return {
        success: false,
        error: { code: "auth/not-ready", message: "Auth not ready" },
        requiresReauth: false
      };
    }

    // FIX: Capture user ID early to detect if user changes during operation
    const originalUserId = user.uid;

    if (user.isAnonymous) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[deleteCurrentUser] Cannot delete anonymous user");
      }
      return {
        success: false,
        error: { code: "auth/anonymous", message: "Cannot delete anonymous" },
        requiresReauth: false
      };
    }

    const provider = getUserAuthProvider(user);
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[deleteCurrentUser] User provider:", provider);
    }

    if (provider === "password" && options.autoReauthenticate && options.onPasswordRequired) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[deleteCurrentUser] Password provider, calling attemptReauth");
      }
      const reauth = await attemptReauth(user, options, originalUserId);
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[deleteCurrentUser] attemptReauth result:", reauth);
      }
      if (reauth) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.log("[deleteCurrentUser] Reauth returned result, returning:", reauth);
        }
        return reauth;
      }
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[deleteCurrentUser] Reauth returned null, continuing to deleteUser");
      }
    }

    try {
      // FIX: Verify user hasn't changed before deletion
      const currentUserId = auth.currentUser?.uid;
      if (currentUserId !== originalUserId) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.log("[deleteCurrentUser] User changed during operation");
        }
        return {
          success: false,
          error: { code: "auth/user-changed", message: "User changed during operation" },
          requiresReauth: false
        };
      }

      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[deleteCurrentUser] Calling deleteUser");
      }
      await deleteUser(user);
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[deleteCurrentUser] deleteUser successful");
      }
      return successResult();
    } catch (error: unknown) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.error("[deleteCurrentUser] deleteUser failed:", error);
      }
      const errorInfo = toAuthErrorInfo(error);
      const code = errorInfo.code;
      const message = errorInfo.message;

      const hasCredentials = !!(options.password || options.googleIdToken);
      const shouldReauth = options.autoReauthenticate === true || hasCredentials;

      if (code === "auth/requires-recent-login" && shouldReauth) {
        const reauth = await attemptReauth(user, options, originalUserId);
        if (reauth) return reauth;
      }

      return {
        success: false,
        error: { code, message },
        requiresReauth: code === "auth/requires-recent-login"
      };
    }
  } finally {
    // FIX: Always release lock when done
    deletionInProgress = false;
  }
}

async function attemptReauth(user: User, options: AccountDeletionOptions, originalUserId?: string): Promise<AccountDeletionResult | null> {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[attemptReauth] Called");
  }

  // FIX: Verify user hasn't changed if originalUserId provided
  if (originalUserId) {
    const auth = getFirebaseAuth();
    const currentUserId = auth?.currentUser?.uid;
    if (currentUserId && currentUserId !== originalUserId) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[attemptReauth] User changed during reauthentication");
      }
      return {
        success: false,
        error: { code: "auth/user-changed", message: "User changed during operation" },
        requiresReauth: false
      };
    }
  }

  const provider = getUserAuthProvider(user);
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[attemptReauth] Provider:", provider);
  }

  let res: { success: boolean; error?: { code?: string; message?: string } };

  if (provider === "apple.com") {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[attemptReauth] Apple provider");
    }
    res = await reauthenticateWithApple(user);
  } else if (provider === "google.com") {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[attemptReauth] Google provider");
    }
    let googleToken = options.googleIdToken;
    if (!googleToken && options.onGoogleReauthRequired) {
      const token = await options.onGoogleReauthRequired();
      if (!token) {
        return {
          success: false,
          error: { code: "auth/google-reauth-cancelled", message: "Google reauth cancelled" },
          requiresReauth: true
        };
      }
      googleToken = token;
    }
    if (!googleToken) {
      return {
        success: false,
        error: { code: "auth/google-reauth", message: "Google reauth required" },
        requiresReauth: true
      };
    }
    res = await reauthenticateWithGoogle(user, googleToken);
  } else if (provider === "password") {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[attemptReauth] Password provider, calling onPasswordRequired...");
    }
    let password = options.password;
    if (!password && options.onPasswordRequired) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[attemptReauth] Calling onPasswordRequired callback");
      }
      const pwd = await options.onPasswordRequired();
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[attemptReauth] onPasswordRequired returned:", pwd ? "password received" : "null/cancelled");
      }
      if (!pwd) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.log("[attemptReauth] Password was null/cancelled, returning error");
        }
        return {
          success: false,
          error: { code: "auth/password-reauth-cancelled", message: "Password reauth cancelled" },
          requiresReauth: true
        };
      }
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[attemptReauth] Password received, setting password variable");
      }
      password = pwd;
    }
    if (!password) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[attemptReauth] No password available after callback, returning error");
      }
      return {
        success: false,
        error: { code: "auth/password-reauth", message: "Password required" },
        requiresReauth: true
      };
    }
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[attemptReauth] Calling reauthenticateWithPassword");
    }
    res = await reauthenticateWithPassword(user, password);
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[attemptReauth] reauthenticateWithPassword result:", res);
    }
  } else {
    return null;
  }

  if (res.success) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.log("[attemptReauth] Reauthentication successful, calling deleteUser");
    }
    try {
      const auth = getFirebaseAuth();
      const currentUser = auth?.currentUser || user;

      // FIX: Final verification before deletion
      if (originalUserId && currentUser.uid !== originalUserId) {
        if (typeof __DEV__ !== "undefined" && __DEV__) {
          console.log("[attemptReauth] User changed after reauthentication");
        }
        return {
          success: false,
          error: { code: "auth/user-changed", message: "User changed during operation" },
          requiresReauth: false
        };
      }

      await deleteUser(currentUser);
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.log("[attemptReauth] deleteUser successful after reauth");
      }
      return successResult();
    } catch (err: unknown) {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.error("[attemptReauth] deleteUser failed after reauth:", err);
      }
      const errorInfo = toAuthErrorInfo(err);
      return {
        success: false,
        error: { code: errorInfo.code, message: errorInfo.message },
        requiresReauth: false
      };
    }
  }

  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[attemptReauth] Reauthentication failed, returning error");
  }
  return {
    success: false,
    error: {
      code: res.error?.code || "auth/reauth-failed",
      message: res.error?.message || "Reauth failed",
    },
    requiresReauth: true
  };
}

export async function deleteUserAccount(user: User | null): Promise<AccountDeletionResult> {
  if (!user || user.isAnonymous) {
    return {
      success: false,
      error: { code: "auth/invalid", message: "Invalid user" },
      requiresReauth: false
    };
  }

  try {
    await deleteUser(user);
    return successResult();
  } catch (error: unknown) {
    const errorInfo = toAuthErrorInfo(error);
    return {
      success: false,
      error: { code: errorInfo.code, message: errorInfo.message },
      requiresReauth: errorInfo.code === "auth/requires-recent-login"
    };
  }
}
