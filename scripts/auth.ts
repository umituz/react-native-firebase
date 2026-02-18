/**
 * Firebase Admin Auth Utilities
 * Generic auth operations for admin scripts
 */

import * as admin from "firebase-admin";
import type { UserInfo, CleanupResult } from "./types";

/**
 * List all users from Firebase Auth
 */
export async function listAllUsers(auth: admin.auth.Auth): Promise<UserInfo[]> {
  const users: UserInfo[] = [];
  let nextPageToken: string | undefined;

  do {
    const result = await auth.listUsers(1000, nextPageToken);

    result.users.forEach((user) => {
      users.push({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        isAnonymous: !user.providerData || user.providerData.length === 0,
        createdAt: user.metadata.creationTime
          ? new Date(user.metadata.creationTime)
          : undefined,
        providerCount: user.providerData?.length ?? 0,
      });
    });

    nextPageToken = result.pageToken;
  } while (nextPageToken);

  return users;
}

/**
 * List only authenticated users (with email/providers)
 */
export async function listAuthenticatedUsers(
  auth: admin.auth.Auth
): Promise<UserInfo[]> {
  const allUsers = await listAllUsers(auth);
  return allUsers.filter((user) => !user.isAnonymous && user.email);
}

/**
 * List only anonymous users
 */
export async function listAnonymousUsers(
  auth: admin.auth.Auth
): Promise<UserInfo[]> {
  const allUsers = await listAllUsers(auth);
  return allUsers.filter((user) => user.isAnonymous);
}

/**
 * Delete users by UIDs
 */
export async function deleteUsers(
  auth: admin.auth.Auth,
  uids: string[],
  onProgress?: (deleted: number, total: number) => void
): Promise<CleanupResult> {
  const result: CleanupResult = {
    totalProcessed: uids.length,
    deleted: 0,
    preserved: 0,
    errors: [],
  };

  for (const uid of uids) {
    try {
      await auth.deleteUser(uid);
      result.deleted++;
      onProgress?.(result.deleted, uids.length);
    } catch (error) {
      result.errors.push(`Failed to delete ${uid}: ${error}`);
    }
  }

  return result;
}

/**
 * Cleanup anonymous users - delete all users without providers
 */
export async function cleanupAnonymousUsers(
  auth: admin.auth.Auth,
  onProgress?: (deleted: number, total: number) => void
): Promise<CleanupResult> {
  const anonymousUsers = await listAnonymousUsers(auth);
  const uids = anonymousUsers.map((u) => u.uid);

  if (uids.length === 0) {
    return {
      totalProcessed: 0,
      deleted: 0,
      preserved: 0,
      errors: [],
    };
  }

  const deleteResult = await deleteUsers(auth, uids, onProgress);

  // Count preserved (authenticated) users
  const authenticatedUsers = await listAuthenticatedUsers(auth);
  deleteResult.preserved = authenticatedUsers.length;

  return deleteResult;
}

/**
 * Delete all users from Firebase Auth
 */
export async function deleteAllUsers(
  auth: admin.auth.Auth,
  onProgress?: (deleted: number, total: number) => void
): Promise<CleanupResult> {
  const allUsers = await listAllUsers(auth);
  const uids = allUsers.map((u) => u.uid);
  return deleteUsers(auth, uids, onProgress);
}

/**
 * Get user statistics
 */
export async function getUserStats(auth: admin.auth.Auth): Promise<{
  total: number;
  anonymous: number;
  authenticated: number;
}> {
  const allUsers = await listAllUsers(auth);
  const anonymous = allUsers.filter((u) => u.isAnonymous).length;

  return {
    total: allUsers.length,
    anonymous,
    authenticated: allUsers.length - anonymous,
  };
}
