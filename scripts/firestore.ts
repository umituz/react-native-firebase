/**
 * Firebase Admin Firestore Utilities
 * Generic Firestore operations for admin scripts
 */

// Query functions
export {
  listCollections,
  listUserSubcollections,
  countDocuments,
  getUserStats,
} from "./firestore-queries";

// Delete operations
export {
  deleteCollection,
  deleteUserSubcollection,
  deleteAllData,
} from "./firestore-operations";

// Seed operations
export {
  seedBatch,
  seedUserSubcollection,
} from "./firestore-seeding";
