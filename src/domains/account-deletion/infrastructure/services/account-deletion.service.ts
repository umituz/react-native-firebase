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

export async function deleteCurrentUser(
  options: AccountDeletionOptions = { autoReauthenticate: true }
): Promise<AccountDeletionResult> {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[deleteCurrentUser] Called with options:", options);
  }

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
    const reauth = await attemptReauth(user, options);
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
      const reauth = await attemptReauth(user, options);
      if (reauth) return reauth;
    }

    return {
      success: false,
      error: { code, message },
      requiresReauth: code === "auth/requires-recent-login"
    };
  }
}

async function attemptReauth(user: User, options: AccountDeletionOptions): Promise<AccountDeletionResult | null> {
  if (typeof __DEV__ !== "undefined" && __DEV__) {
    console.log("[attemptReauth] Called");
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
