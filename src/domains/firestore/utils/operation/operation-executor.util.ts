/**
 * Operation Executor Utility
 * Utilities for executing Firestore operations with automatic null checks
 */

import type { Firestore } from "../../infrastructure/config/FirestoreClient";
import { getFirestore } from "../../infrastructure/config/FirestoreClient";
import type { FirestoreResult } from "../result/result.util";
import { createNoDbErrorResult } from "../result/result.util";

/**
 * Execute a Firestore operation with automatic null check
 * Returns error result if db is not available
 */
export async function withFirestore<T>(
  operation: (db: Firestore) => Promise<FirestoreResult<T>>,
): Promise<FirestoreResult<T>> {
  const db = getFirestore();
  if (!db) {
    return createNoDbErrorResult<T>();
  }
  return operation(db);
}

/**
 * Execute a Firestore operation that returns void
 */
export async function withFirestoreVoid(
  operation: (db: Firestore) => Promise<void>,
): Promise<void> {
  const db = getFirestore();
  if (!db) {
    return;
  }
  return operation(db);
}

/**
 * Execute a Firestore operation that returns boolean
 */
export async function withFirestoreBool(
  operation: (db: Firestore) => Promise<boolean>,
): Promise<boolean> {
  const db = getFirestore();
  if (!db) {
    return false;
  }
  return operation(db);
}
