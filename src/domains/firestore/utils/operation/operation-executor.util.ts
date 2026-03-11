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
 * Returns Result<void> for consistent error handling
 */
export async function withFirestoreVoid(
  operation: (db: Firestore) => Promise<void>,
): Promise<Result<void>> {
  const db = getFirestore();
  if (!db) {
    return createNoDbErrorResult<void>();
  }
  try {
    await operation(db);
    return { success: true, data: undefined as void };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Operation failed';
    return { success: false, error: { code: 'firestore/operation-failed', message } };
  }
}

/**
 * Execute a Firestore operation that returns boolean
 * Returns Result<boolean> for consistent error handling
 */
export async function withFirestoreBool(
  operation: (db: Firestore) => Promise<boolean>,
): Promise<Result<boolean>> {
  const db = getFirestore();
  if (!db) {
    return createNoDbErrorResult<boolean>();
  }
  try {
    const result = await operation(db);
    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Operation failed';
    return { success: false, error: { code: 'firestore/operation-failed', message } };
  }
}
