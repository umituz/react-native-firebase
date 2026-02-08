/**
 * Firestore Helper - Centralized Firestore access utilities
 * Provides common patterns for Firestore operations with error handling
 */

export type { Firestore } from "../infrastructure/config/FirestoreClient";

// Re-export result utilities
export {
  createErrorResult,
  createSuccessResult,
  isSuccess,
  isError,
  type FirestoreResult,
  type NoDbResult,
  NO_DB_ERROR,
} from "./result/result.util";

// Re-export operation utilities
export {
  withFirestore,
  withFirestoreVoid,
  withFirestoreBool,
} from "./operation/operation-executor.util";

// Re-export transaction utilities
export { runTransaction, serverTimestamp } from "./transaction/transaction.util";
