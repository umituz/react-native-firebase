/**
 * Account Deletion Service
 */

import { deleteUser, type User } from "firebase/auth";
import { getFirebaseAuth } from "../config/FirebaseAuthClient";
import {
  getUserAuthProvider,
  reauthenticateWithApple,
  reauthenticateWithPassword,
  reauthenticateWithGoogle,
} from "./reauthentication.service";
import { toAuthErrorInfo } from "../../../domain/utils/error-handler.util";
import type { AccountDeletionResult, AccountDeletionOptions } from "./reauthentication.types";

export type { AccountDeletionResult, AccountDeletionOptions } from "./reauthentication.types";

export async function deleteCurrentUser(
  options: AccountDeletionOptions = { autoReauthenticate: true }
): Promise<AccountDeletionResult> {
  const auth = getFirebaseAuth();
  const user = auth?.currentUser;

  if (!auth || !user) return {
    success: false,
    error: { code: "auth/not-ready", message: "Auth not ready", requiresReauth: false }
  };
  if (user.isAnonymous) return {
    success: false,
    error: { code: "auth/anonymous", message: "Cannot delete anonymous", requiresReauth: false }
  };

  try {
    await deleteUser(user);
    return { success: true };
  } catch (error: unknown) {
    const authErr = toAuthErrorInfo(error);
    if (authErr.code === "auth/requires-recent-login" && (options.autoReauthenticate || options.password || options.googleIdToken)) {
      const reauth = await attemptReauth(user, options);
      if (reauth) return reauth;
    }
    return {
      success: false,
      error: { ...authErr, requiresReauth: authErr.code === "auth/requires-recent-login" }
    };
  }
}

async function attemptReauth(user: User, options: AccountDeletionOptions): Promise<AccountDeletionResult | null> {
  const provider = getUserAuthProvider(user);
  let res: { success: boolean; error?: { code?: string; message?: string } };

  if (provider === "apple.com") res = await reauthenticateWithApple(user);
  else if (provider === "google.com") {
    if (!options.googleIdToken) return { success: false, error: { code: "auth/google-reauth", message: "Google reauth required", requiresReauth: true } };
    res = await reauthenticateWithGoogle(user, options.googleIdToken);
  } else if (provider === "password") {
    if (!options.password) return { success: false, error: { code: "auth/password-reauth", message: "Password required", requiresReauth: true } };
    res = await reauthenticateWithPassword(user, options.password);
  } else return null;

  if (res.success) {
    try {
      await deleteUser(user);
      return { success: true };
    } catch (err: unknown) {
      const authErr = toAuthErrorInfo(err);
      return { success: false, error: { ...authErr, requiresReauth: false } };
    }
  }
  return { success: false, error: { code: res.error?.code || "auth/reauth-failed", message: res.error?.message || "Reauth failed", requiresReauth: true } };
}

export async function deleteUserAccount(user: User | null): Promise<AccountDeletionResult> {
  if (!user || user.isAnonymous) return { success: false, error: { code: "auth/invalid", message: "Invalid user", requiresReauth: false } };
  try {
    await deleteUser(user);
    return { success: true };
  } catch (error: unknown) {
    const authErr = toAuthErrorInfo(error);
    return { success: false, error: { ...authErr, requiresReauth: authErr.code === "auth/requires-recent-login" } };
  }
}
