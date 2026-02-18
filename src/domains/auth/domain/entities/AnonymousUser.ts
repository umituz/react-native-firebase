/**
 * Anonymous User Entity
 * Represents a Firebase Anonymous Auth user
 */

import type { User } from "firebase/auth";

export interface AnonymousUser {
  readonly uid: string;
  readonly isAnonymous: boolean;
  readonly createdAt?: number;
}

/**
 * Check if a Firebase User is anonymous
 */
export function isAnonymousUser(user: User | null | undefined): user is User & { isAnonymous: true } {
  return user?.isAnonymous === true;
}

/**
 * Convert Firebase User to AnonymousUser entity
 */
export function toAnonymousUser(user: User): AnonymousUser {
  return {
    uid: user.uid,
    isAnonymous: user.isAnonymous,
    createdAt: user.metadata.creationTime
      ? new Date(user.metadata.creationTime).getTime()
      : Date.now(),
  };
}

