/**
 * Firebase Admin Initialization
 * Dynamic configuration - no hardcoded values
 */

import * as admin from "firebase-admin";
import type { FirebaseAdminConfig } from "./types";

let initializedApp: admin.app.App | null = null;

/**
 * Initialize Firebase Admin SDK with config
 * @param config - Firebase Admin configuration
 * @returns Initialized Firebase Admin app
 */
export function initFirebaseAdmin(config: FirebaseAdminConfig): admin.app.App {
  if (initializedApp) {
    return initializedApp;
  }

  if (admin.apps.length > 0) {
    initializedApp = admin.apps[0]!;
    return initializedApp;
  }

  initializedApp = admin.initializeApp({
    credential: admin.credential.cert(config.serviceAccountPath),
    projectId: config.projectId,
    storageBucket: config.storageBucket,
  });

  return initializedApp;
}

/**
 * Get Firestore instance
 */
export function getFirestoreAdmin(app: admin.app.App): admin.firestore.Firestore {
  return admin.firestore(app);
}

/**
 * Get Auth instance
 */
export function getAuthAdmin(app: admin.app.App): admin.auth.Auth {
  return admin.auth(app);
}

/**
 * Get Storage bucket
 */
export function getStorageAdmin(app: admin.app.App): admin.storage.Storage {
  return admin.storage(app);
}

/**
 * Reset initialized app (for testing)
 */
export async function resetFirebaseAdmin(): Promise<void> {
  if (initializedApp) {
    await initializedApp.delete();
    initializedApp = null;
  }
}
