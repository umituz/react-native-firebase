/**
 * Account Deletion Service
 * Handles Firebase account deletion with reauthentication support
 */

import { deleteUser, type User } from "firebase/auth";
import { getFirebaseAuth } from "../../../auth/infrastructure/config/FirebaseAuthClient";
import { markUserDeleted } from "../../../auth/infrastructure/services/user-document.service";
import {
  getUserAuthProvider,
  reauthenticateWithApple,
  reauthenticateWithPassword,
  reauthenticateWithGoogle,
} from "./reauthentication.service";
import { successResult, type Result, toErrorInfo } from "../../../../shared/domain/utils";
import type { AccountDeletionOptions } from "../../application/ports/reauthentication.types";
import { validateUserUnchanged } from "../../../auth/domain/utils/user-validation.util";

export interface AccountDeletionResult extends Result<void> {
  requiresReauth?: boolean;
}

// Operation lock to prevent concurrent deletion attempts
let deletionInProgress = false;

export async function deleteCurrentUser(
  options: AccountDeletionOptions = { autoReauthenticate: true }
): Promise<AccountDeletionResult> {
  if (deletionInProgress) {
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
      return {
        success: false,
        error: { code: "auth/not-ready", message: "Auth not ready" },
        requiresReauth: false
      };
    }

    const originalUserId = user.uid;

    if (user.isAnonymous) {
      return {
        success: false,
        error: { code: "auth/anonymous", message: "Cannot delete anonymous" },
        requiresReauth: false
      };
    }

    const provider = getUserAuthProvider(user);

    if (provider === "password" && options.autoReauthenticate && options.onPasswordRequired) {
      const reauth = await attemptReauth(user, options, originalUserId);
      if (reauth) {
        return reauth;
      }
    }

    try {
      const validation = validateUserUnchanged(auth, originalUserId);
      if (!('valid' in validation)) {
        return {
          success: false,
          error: validation.error,
          requiresReauth: false
        };
      }

      await markUserDeleted(user.uid);
      await deleteUser(user);
      return successResult();
    } catch (error: unknown) {
      const errorInfo = toErrorInfo(error, 'auth/failed');
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
    deletionInProgress = false;
  }
}

async function attemptReauth(user: User, options: AccountDeletionOptions, originalUserId?: string): Promise<AccountDeletionResult | null> {
  if (originalUserId) {
    const authInstance = getFirebaseAuth();
    const validation = validateUserUnchanged(authInstance, originalUserId);
    if (!('valid' in validation)) {
      return {
        success: false,
        error: validation.error,
        requiresReauth: false
      };
    }
  }

  const provider = getUserAuthProvider(user);

  let res: { success: boolean; error?: { code?: string; message?: string } };

  if (provider === "apple.com") {
    res = await reauthenticateWithApple(user);
  } else if (provider === "google.com") {
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
    let password = options.password;
    if (!password && options.onPasswordRequired) {
      const pwd = await options.onPasswordRequired();
      if (!pwd) {
        return {
          success: false,
          error: { code: "auth/password-reauth-cancelled", message: "Password reauth cancelled" },
          requiresReauth: true
        };
      }
      password = pwd;
    }
    if (!password) {
      return {
        success: false,
        error: { code: "auth/password-reauth", message: "Password required" },
        requiresReauth: true
      };
    }
    res = await reauthenticateWithPassword(user, password);
  } else {
    return null;
  }

  if (res.success) {
    try {
      const postReauthAuth = getFirebaseAuth();
      const currentUser = postReauthAuth?.currentUser || user;

      if (originalUserId) {
        const validationCheck = validateUserUnchanged(postReauthAuth, originalUserId);
        if (!('valid' in validationCheck)) {
          return {
            success: false,
            error: validationCheck.error,
            requiresReauth: false
          };
        }
      }

      await markUserDeleted(currentUser.uid);
      await deleteUser(currentUser);
      return successResult();
    } catch (err: unknown) {
      const errorInfo = toErrorInfo(err, 'auth/failed');
      return {
        success: false,
        error: { code: errorInfo.code, message: errorInfo.message },
        requiresReauth: false
      };
    }
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
    const errorInfo = toErrorInfo(error, 'auth/failed');
    return {
      success: false,
      error: { code: errorInfo.code, message: errorInfo.message },
      requiresReauth: errorInfo.code === "auth/requires-recent-login"
    };
  }
}
