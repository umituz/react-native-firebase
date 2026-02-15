/**
 * Email/Password Authentication Service
 * Handles email/password sign in, sign up, and account linking
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  EmailAuthProvider,
  linkWithCredential,
  type User,
} from "firebase/auth";
import { getFirebaseAuth } from "../config/FirebaseAuthClient";
import { executeOperation, failureResultFrom, successResult, toAuthErrorInfo, type Result, ERROR_MESSAGES } from "../../../../shared/domain/utils";

export interface EmailCredentials {
  email: string;
  password: string;
  displayName?: string;
}

export type EmailAuthResult = Result<User>;

/**
 * Sign in with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<EmailAuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return failureResultFrom("auth/not-ready", ERROR_MESSAGES.AUTH.NOT_INITIALIZED);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return { success: true, data: userCredential.user };
  } catch (error) {
    // FIX: Use toAuthErrorInfo() instead of unsafe cast
    return { success: false, error: toAuthErrorInfo(error) };
  }
}

/**
 * Sign up with email and password
 * Automatically links with anonymous account if one exists
 */
export async function signUpWithEmail(
  credentials: EmailCredentials
): Promise<EmailAuthResult> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return failureResultFrom("auth/not-ready", ERROR_MESSAGES.AUTH.NOT_INITIALIZED);
  }

  try {
    const currentUser = auth.currentUser;
    const isAnonymous = currentUser?.isAnonymous ?? false;
    let userCredential;

    if (currentUser && isAnonymous) {
      // Link anonymous account with email
      const credential = EmailAuthProvider.credential(
        credentials.email.trim(),
        credentials.password
      );
      userCredential = await linkWithCredential(currentUser, credential);
    } else {
      // Create new account
      userCredential = await createUserWithEmailAndPassword(
        auth,
        credentials.email.trim(),
        credentials.password
      );
    }

    // Update display name if provided (non-critical operation)
    if (credentials.displayName && userCredential.user) {
      const trimmedName = credentials.displayName.trim();
      // FIX: Only update if non-empty after trim
      if (trimmedName.length > 0) {
        try {
          await updateProfile(userCredential.user, {
            displayName: trimmedName,
          });
        } catch (profileError) {
          // Profile update failed but account was created successfully
          // Log the error but don't fail the signup
          console.warn("Profile update failed after account creation:", profileError);
        }
      }
    }

    return { success: true, data: userCredential.user };
  } catch (error) {
    // FIX: Use toAuthErrorInfo() instead of unsafe cast
    return { success: false, error: toAuthErrorInfo(error) };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<Result<void>> {
  const auth = getFirebaseAuth();
  if (!auth) {
    return successResult();
  }

  return executeOperation(async () => {
    await firebaseSignOut(auth);
  });
}

/**
 * Link anonymous account with email/password
 */
export async function linkAnonymousWithEmail(
  email: string,
  password: string
): Promise<EmailAuthResult> {
  const auth = getFirebaseAuth();
  if (!auth || !auth.currentUser) {
    return failureResultFrom("auth/not-ready", ERROR_MESSAGES.AUTH.NO_USER);
  }

  const currentUser = auth.currentUser;
  if (!currentUser.isAnonymous) {
    return failureResultFrom("auth/invalid-action", ERROR_MESSAGES.AUTH.INVALID_USER);
  }

  try {
    const credential = EmailAuthProvider.credential(email.trim(), password);
    const userCredential = await linkWithCredential(currentUser, credential);
    return { success: true, data: userCredential.user };
  } catch (error) {
    // FIX: Use toAuthErrorInfo() instead of unsafe cast
    return { success: false, error: toAuthErrorInfo(error) };
  }
}
