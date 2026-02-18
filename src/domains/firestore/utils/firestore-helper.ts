/**
 * Firestore Helper - Centralized Firestore access utilities
 * Provides common patterns for Firestore operations with error handling
 */

export {
  createErrorResult,
  createSuccessResult,
  type NoDbResult,
} from "./result/result.util";

export {
  withFirestore,
  withFirestoreVoid,
  withFirestoreBool,
} from "./operation/operation-executor.util";

export { runTransaction, serverTimestamp } from "./transaction/transaction.util";
