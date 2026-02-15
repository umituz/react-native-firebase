/**
 * User Metadata Utilities
 * Shared utilities for working with Firebase user metadata
 * Eliminates duplicate isNewUser logic across auth services
 */

import type { UserCredential, User, UserMetadata } from 'firebase/auth';

/**
 * Check if user is new based on metadata timestamps
 * Compares creation time and last sign-in time to determine if this is the user's first login
 *
 * A user is considered "new" if their account creation time matches their last sign-in time,
 * indicating this is their first authentication.
 *
 * @param input - UserCredential, User, or UserMetadata to check
 * @returns True if user is new (first sign-in), false otherwise
 *
 * @example
 * ```typescript
 * // From UserCredential
 * const credential = await signInWithCredential(auth, oauthCredential);
 * if (isNewUser(credential)) {
 *   // Show onboarding
 * }
 *
 * // From User object
 * const user = auth.currentUser;
 * if (user && isNewUser(user)) {
 *   // First time user
 * }
 *
 * // From UserMetadata directly
 * if (isNewUser(user.metadata)) {
 *   // New user
 * }
 * ```
 */
export function isNewUser(userCredential: UserCredential): boolean;
export function isNewUser(user: User): boolean;
export function isNewUser(metadata: UserMetadata): boolean;
export function isNewUser(input: UserCredential | User | UserMetadata): boolean {
  let metadata: UserMetadata;

  // Extract metadata from different input types
  if ('user' in input) {
    // UserCredential
    metadata = input.user.metadata;
  } else if ('metadata' in input) {
    // User
    metadata = input.metadata;
  } else {
    // UserMetadata
    metadata = input;
  }

  const { creationTime, lastSignInTime } = metadata;

  // Validate timestamps exist and are strings
  if (
    !creationTime ||
    !lastSignInTime ||
    typeof creationTime !== 'string' ||
    typeof lastSignInTime !== 'string'
  ) {
    return false;
  }

  // Convert to timestamps for reliable comparison
  // If creation time === last sign in time, this is the first sign-in
  return new Date(creationTime).getTime() === new Date(lastSignInTime).getTime();
}
