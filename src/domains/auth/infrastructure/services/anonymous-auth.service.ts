/**
 * Anonymous Auth Service
 * Service for managing anonymous/guest authentication
 */

import { signInAnonymously, type Auth, type User } from "firebase/auth";
import { toAnonymousUser, type AnonymousUser } from "../../domain/entities/AnonymousUser";
import { ERROR_MESSAGES } from "../../../../shared/domain/utils/error-handlers/error-messages";

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
    if (!auth) throw new Error(ERROR_MESSAGES.AUTH.NOT_INITIALIZED);

    const currentUser = auth.currentUser;

    if (currentUser && currentUser.isAnonymous) {
      return {
        user: currentUser,
        anonymousUser: toAnonymousUser(currentUser),
        wasAlreadySignedIn: true,
      };
    }

    if (currentUser && !currentUser.isAnonymous) {
      throw new Error(ERROR_MESSAGES.AUTH.SIGN_OUT_REQUIRED);
    }

    const userCredential = await signInAnonymously(auth);

    if (!userCredential.user.isAnonymous) {
      throw new Error(ERROR_MESSAGES.AUTH.INVALID_USER);
    }

    const anonymousUser = toAnonymousUser(userCredential.user);
    return {
      user: userCredential.user,
      anonymousUser,
      wasAlreadySignedIn: false,
    };
  }
}

export const anonymousAuthService = new AnonymousAuthService();
