/**
 * Firestore Helper - Centralized Firestore access utilities
 * Provides common patterns for Firestore operations with error handling
 */
import { getFirestore } from "../infrastructure/config/FirestoreClient";
import type { Firestore } from "../infrastructure/config/FirestoreClient";

export interface FirestoreResult<T> {
  success: boolean;
  data?: T;
  error?: { message: string; code: string };
}

export type NoDbResult = FirestoreResult<never>;

const NO_DB_ERROR: NoDbResult = {
  success: false,
  error: { message: "No DB", code: "DB_ERR" },
};

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
  logTag?: string
): Promise<FirestoreResult<T>> {
  const db = getDb();
  if (!db) {
    if (__DEV__ && logTag) {
      console.log(`[${logTag}] No Firestore instance`);
    }
    return NO_DB_ERROR as FirestoreResult<T>;
  }
  return operation(db);
}

/**
 * Execute a Firestore operation that returns void
 */
export async function withFirestoreVoid(
  operation: (db: Firestore) => Promise<void>,
  logTag?: string
): Promise<void> {
  const db = getDb();
  if (!db) {
    if (__DEV__ && logTag) {
      console.log(`[${logTag}] No Firestore instance`);
    }
    return;
  }
  return operation(db);
}

/**
 * Execute a Firestore operation that returns boolean
 */
export async function withFirestoreBool(
  operation: (db: Firestore) => Promise<boolean>,
  logTag?: string
): Promise<boolean> {
  const db = getDb();
  if (!db) {
    if (__DEV__ && logTag) {
      console.log(`[${logTag}] No Firestore instance`);
    }
    return false;
  }
  return operation(db);
}

/**
 * Create a standard error result
 */
export function createErrorResult<T>(message: string, code: string): FirestoreResult<T> {
  return { success: false, error: { message, code } };
}

/**
 * Create a standard success result
 */
export function createSuccessResult<T>(data?: T): FirestoreResult<T> {
  return { success: true, data };
}
