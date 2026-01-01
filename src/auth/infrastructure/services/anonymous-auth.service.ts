/**
 * Anonymous Auth Service
 * Service for managing anonymous/guest authentication
 */

import { signInAnonymously, type Auth, type User } from "firebase/auth";
import { toAnonymousUser, type AnonymousUser } from "../../domain/entities/AnonymousUser";
import { checkAuthState } from "./auth-utils.service";

export interface AnonymousAuthResult {
  readonly user: User;
  readonly anonymousUser: AnonymousUser;
  readonly wasAlreadySignedIn: boolean;
}

export class AnonymousAuthService {
  async signInAnonymously(auth: Auth): Promise<AnonymousAuthResult> {
    if (!auth) throw new Error("Firebase Auth instance is required");

    const currentUser = auth.currentUser;

    if (currentUser && !currentUser.isAnonymous) {
      return {
        user: currentUser,
        anonymousUser: toAnonymousUser(currentUser),
        wasAlreadySignedIn: true,
      };
    }

    if (currentUser && currentUser.isAnonymous) {
      return {
        user: currentUser,
        anonymousUser: toAnonymousUser(currentUser),
        wasAlreadySignedIn: true,
      };
    }

    try {
      const userCredential = await signInAnonymously(auth);
      const anonymousUser = toAnonymousUser(userCredential.user);
      return {
        user: userCredential.user,
        anonymousUser,
        wasAlreadySignedIn: false,
      };
    } catch (error) {
      if (__DEV__) console.error("[AnonymousAuthService] Failed", error);
      throw error;
    }
  }
}

export const anonymousAuthService = new AnonymousAuthService();
