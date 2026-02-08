/**
 * Firestore Helper - Centralized Firestore access utilities
 * Provides common patterns for Firestore operations with error handling
 */

import { getFirestore } from "../infrastructure/config/FirestoreClient";
import type { Firestore } from "../infrastructure/config/FirestoreClient";
import {
  createErrorResult,
  createSuccessResult,
  type FirestoreResult,
  type NoDbResult,
  NO_DB_ERROR,
} from "./result/result.util";
import {
  withFirestore as withFirestoreOp,
  withFirestoreVoid as withFirestoreVoidOp,
  withFirestoreBool as withFirestoreBoolOp,
} from "./operation/operation-executor.util";

/**
 * Get Firestore instance with null check
 */
export function getDb(): Firestore | null {
  return getFirestore();
}

/**
 * Execute a Firestore operation with automatic null check
 * Returns error result if db is not available
 */
export async function withFirestore<T>(
  operation: (db: Firestore) => Promise<FirestoreResult<T>>,
): Promise<FirestoreResult<T>> {
  return withFirestoreOp(operation);
}

/**
 * Execute a Firestore operation that returns void
 */
export async function withFirestoreVoid(
  operation: (db: Firestore) => Promise<void>,
): Promise<void> {
  return withFirestoreVoidOp(operation);
}

/**
 * Execute a Firestore operation that returns boolean
 */
export async function withFirestoreBool(
  operation: (db: Firestore) => Promise<boolean>,
): Promise<boolean> {
  return withFirestoreBoolOp(operation);
}

// Re-export result utilities
export { createErrorResult, createSuccessResult, type FirestoreResult, type NoDbResult, NO_DB_ERROR };
export { isSuccess, isError } from "./result/result.util";

// Re-export transaction utilities
export { runTransaction, serverTimestamp } from "./transaction/transaction.util";

