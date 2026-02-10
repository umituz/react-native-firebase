/**
 * Anonymous Auth Service
 * Service for managing anonymous/guest authentication
 */

import { signInAnonymously, type Auth, type User } from "firebase/auth";
import { toAnonymousUser, type AnonymousUser } from "../../domain/entities/AnonymousUser";

export interface AnonymousAuthResult {
  readonly user: User;
  readonly anonymousUser: AnonymousUser;
  readonly wasAlreadySignedIn: boolean;
}

export interface AnonymousAuthServiceInterface {
  signInAnonymously(auth: Auth): Promise<AnonymousAuthResult>;
}

export class AnonymousAuthService implements AnonymousAuthServiceInterface {
  async signInAnonymously(auth: Auth): Promise<AnonymousAuthResult> {
    if (!auth) throw new Error("Firebase Auth instance is required");

    const currentUser = auth.currentUser;

    if (currentUser && currentUser.isAnonymous) {
      return {
        user: currentUser,
        anonymousUser: toAnonymousUser(currentUser),
        wasAlreadySignedIn: true,
      };
    }

    if (currentUser && !currentUser.isAnonymous) {
      throw new Error("A non-anonymous user is already signed in. Sign out first before creating an anonymous session.");
    }

    const userCredential = await signInAnonymously(auth);
    const anonymousUser = toAnonymousUser(userCredential.user);
    return {
      user: userCredential.user,
      anonymousUser,
      wasAlreadySignedIn: false,
    };
  }
}

export const anonymousAuthService = new AnonymousAuthService();
