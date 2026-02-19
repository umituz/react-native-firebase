/**
 * Google Auth Service
 * Handles Google Sign-In with Firebase Authentication
 */

import {
  GoogleAuthProvider,
  signInWithCredential,
  type Auth,
  type UserCredential,
} from "firebase/auth";
import type { GoogleAuthConfig, GoogleAuthResult } from "./google-auth.types";
import { executeAuthOperation, type Result } from "../../../../shared/domain/utils";
import { ConfigurableService } from "../../../../shared/domain/utils/service-config.util";
import { isNewUser as checkIsNewUser } from "../../domain/utils/user-metadata.util";
import { convertToOAuthResult } from "./utils/auth-result-converter.util";

/**
 * Google Auth Service
 * Provides Google Sign-In functionality for Firebase
 */
export class GoogleAuthService extends ConfigurableService<GoogleAuthConfig> {
  protected override isValidConfig(config: GoogleAuthConfig): boolean {
    return (
      config !== null &&
      (!!config.webClientId || !!config.iosClientId || !!config.androidClientId)
    );
  }

  private convertToGoogleAuthResult(result: Result<{ userCredential: UserCredential; isNewUser: boolean }>): GoogleAuthResult {
    return convertToOAuthResult(result, "Google sign-in failed");
  }

  async signInWithIdToken(
    auth: Auth,
    idToken: string,
  ): Promise<GoogleAuthResult> {
    const result = await executeAuthOperation(async () => {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);

      // Check if user is new using shared utility
      const isNewUser = checkIsNewUser(userCredential);

      return {
        userCredential,
        isNewUser
      };
    });
    return this.convertToGoogleAuthResult(result);
  }
}

export const googleAuthService = new GoogleAuthService();
