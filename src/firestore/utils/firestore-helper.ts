/**
 * Firestore Helper - Centralized Firestore access utilities
 * Provides common patterns for Firestore operations with error handling
 */

export type { Firestore } from "../infrastructure/config/FirestoreClient";

export {
  createErrorResult,
  createSuccessResult,
  isSuccess,
  isError,
  type FirestoreResult,
  type NoDbResult,
  NO_DB_ERROR,
} from "./result/result.util";

export {
  withFirestore,
  withFirestoreVoid,
  withFirestoreBool,
} from "./operation/operation-executor.util";

export { runTransaction, serverTimestamp } from "./transaction/transaction.util";
