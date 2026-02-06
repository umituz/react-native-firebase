/**
 * Apple Auth Types
 */

import type { UserCredential } from "firebase/auth";

export interface AppleAuthResult {
  success: boolean;
  userCredential?: UserCredential;
  error?: string;
  isNewUser?: boolean;
}
