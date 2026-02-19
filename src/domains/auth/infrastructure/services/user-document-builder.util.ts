/**
 * User Document Builder Utility
 * Builds user document data for Firestore (max 100 lines)
 */

import { serverTimestamp } from "firebase/firestore";
import type {
  UserDocumentUser,
  UserDocumentExtras,
} from "./user-document.types";

/**
 * Type guard to check if user has provider data
 */
function hasProviderData(user: unknown): user is { providerData: { providerId: string }[] } {
  return (
    typeof user === 'object' &&
    user !== null &&
    'providerData' in user &&
    Array.isArray((user as Record<string, unknown>).providerData)
  );
}

/**
 * Gets the sign-up method from user provider data
 */
export function getSignUpMethod(user: UserDocumentUser): string | undefined {
  if (user.isAnonymous) return "anonymous";
  if (user.email) {
    if (hasProviderData(user) && user.providerData.length > 0) {
      const providerId = user.providerData[0]?.providerId;
      if (providerId === "google.com") return "google";
      if (providerId === "apple.com") return "apple";
      if (providerId === "password") return "email";
    }
    return "email";
  }
  return undefined;
}

/**
 * Builds base user data from user object and extras
 */
export function buildBaseData(
  user: UserDocumentUser,
  extras?: UserDocumentExtras,
): Record<string, unknown> {
  const data: Record<string, unknown> = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous,
  };

  if (extras) {
    const internalFields = ["signUpMethod", "previousAnonymousUserId"];
    Object.keys(extras).forEach((key) => {
      if (!internalFields.includes(key)) {
        const val = extras[key];
        if (val !== undefined) {
          data[key] = val;
        }
      }
    });
  }

  return data;
}

/**
 * Builds user document data for creation
 */
export function buildCreateData(
  baseData: Record<string, unknown>,
  extraFields: Record<string, unknown> | undefined,
  extras?: UserDocumentExtras,
): Record<string, unknown> {
  const createData: Record<string, unknown> = {
    ...baseData,
    ...extraFields,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  if (extras?.previousAnonymousUserId) {
    createData.previousAnonymousUserId = extras.previousAnonymousUserId;
    createData.convertedFromAnonymous = true;
    createData.convertedAt = serverTimestamp();
  }

  if (extras?.signUpMethod) createData.signUpMethod = extras.signUpMethod;

  return createData;
}

/**
 * Builds user document data for update
 */
export function buildUpdateData(
  baseData: Record<string, unknown>,
  extras?: UserDocumentExtras,
): Record<string, unknown> {
  const updateData: Record<string, unknown> = {
    ...baseData,
    lastLoginAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (extras?.previousAnonymousUserId) {
    updateData.previousAnonymousUserId = extras.previousAnonymousUserId;
    updateData.convertedFromAnonymous = true;
    updateData.convertedAt = serverTimestamp();
    if (extras?.signUpMethod) updateData.signUpMethod = extras.signUpMethod;
  }

  return updateData;
}
