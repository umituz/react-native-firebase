/**
 * Firebase Admin Scripts
 *
 * Generic utilities for Firebase Admin operations.
 * Use these for CLI scripts, seeding, cleanup, and testing.
 *
 * Usage:
 *   import { initFirebaseAdmin, cleanupAnonymousUsers } from "@umituz/react-native-firebase/scripts";
 *
 *   const app = initFirebaseAdmin({
 *     serviceAccountPath: "./service-account.json",
 *     projectId: "my-project",
 *     storageBucket: "my-project.appspot.com",
 *   });
 *
 *   const auth = getAuthAdmin(app);
 *   await cleanupAnonymousUsers(auth);
 */

// Types
export type {
  FirebaseAdminConfig,
  CollectionInfo,
  UserInfo,
  CleanupResult,
  BatchResult,
  StorageFileInfo,
  ResetSummary,
  UserCredits,
  UserData,
  CreditsConfig,
} from "./types";

// Initialization
export {
  initFirebaseAdmin,
  getFirestoreAdmin,
  getAuthAdmin,
  getStorageAdmin,
  resetFirebaseAdmin,
} from "./init";

// Auth utilities
export {
  listAllUsers,
  listAuthenticatedUsers,
  listAnonymousUsers,
  deleteUsers,
  cleanupAnonymousUsers,
  deleteAllUsers,
  getUserStats as getAuthUserStats,
} from "./auth";

// Firestore utilities
export {
  listCollections,
  listUserSubcollections,
  deleteCollection,
  deleteUserSubcollection,
  deleteAllData,
  seedBatch,
  seedUserSubcollection,
  countDocuments,
  getUserStats as getFirestoreUserStats,
} from "./firestore";

// Storage utilities
export {
  listFiles,
  deleteAllFiles,
  deleteFilesByPrefix,
  getStorageStats,
  deleteUserFiles,
} from "./storage";

// Utility functions
export {
  randomId,
  randomDate,
  randomItem,
  randomNumber,
  randomBoolean,
  sleep,
  formatBytes,
  createConfirmationTimer,
  printSeparator,
  printHeader,
} from "./utils";

// User utilities
export {
  getUserData,
  initializeUserCredits,
  addUserCredits,
  setUserCredits,
  listUsersWithCredits,
  deleteUserCredits,
  getCreditsSummary,
  printUserData,
} from "./user";
