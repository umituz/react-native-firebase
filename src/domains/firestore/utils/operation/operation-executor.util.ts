/**
 * Operation Executor Utility
 * Utilities for executing Firestore operations with automatic null checks
 */

import type { Firestore } from "../../infrastructure/config/FirestoreClient";
import { getFirestore } from "../../infrastructure/config/FirestoreClient";
import type { Result } from "../../../../shared/domain/utils/result/result-types";
import { createNoDbErrorResult } from "../result/result.util";

/**
 * Execute a Firestore operation with automatic null check
 * Returns error result if db is not available
 */
export async function withFirestore<T>(
  operation: (db: Firestore) => Promise<Result<T>>,
): Promise<Result<T>> {
  const db = getFirestore();
  if (!db) {
    return createNoDbErrorResult<T>();
  }
  return operation(db);
}

/**
 * Execute a Firestore operation that returns void
 * @throws {Error} if Firestore is not available
 */
export async function withFirestoreVoid(
  operation: (db: Firestore) => Promise<void>,
): Promise<void> {
  const db = getFirestore();
  if (!db) {
    throw new Error('[withFirestoreVoid] Firestore is not available');
  }
  return operation(db);
}

/**
 * Execute a Firestore operation that returns boolean
 * @throws {Error} if Firestore is not available
 */
export async function withFirestoreBool(
  operation: (db: Firestore) => Promise<boolean>,
): Promise<boolean> {
  const db = getFirestore();
  if (!db) {
    throw new Error('[withFirestoreBool] Firestore is not available');
  }
  return operation(db);
}
