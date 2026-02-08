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
  _logTag?: string
): Promise<FirestoreResult<T>> {
  const db = getDb();
  if (!db) {
    return NO_DB_ERROR as FirestoreResult<T>;
  }
  return operation(db);
}

/**
 * Execute a Firestore operation that returns void
 */
export async function withFirestoreVoid(
  operation: (db: Firestore) => Promise<void>,
  _logTag?: string
): Promise<void> {
  const db = getDb();
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
  _logTag?: string
): Promise<boolean> {
  const db = getDb();
  if (!db) {
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

// ---------------------------------------------------------------------------
// Transaction & Timestamp Wrappers (Facade Pattern)
// ---------------------------------------------------------------------------

import { 
  runTransaction as fbRunTransaction, 
  serverTimestamp as fbServerTimestamp,
  type Transaction 
} from "firebase/firestore";

/**
 * Execute a transaction with automatic DB instance check.
 * Wraps the Firebase runTransaction to ensure the DB is initialized.
 */
export async function runTransaction<T>(
  updateFunction: (transaction: Transaction) => Promise<T>
): Promise<T> {
  const db = getDb();
  if (!db) {
    throw new Error("[runTransaction] Firestore database is not initialized. Please ensure Firebase is properly initialized before running transactions.");
  }
  try {
    return await fbRunTransaction(db, updateFunction);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = error instanceof Error ? (error as { code?: string }).code : 'unknown';

    if (__DEV__) {
      console.error(`[runTransaction] Transaction failed (Code: ${errorCode}):`, errorMessage);
    }

    throw new Error(`[runTransaction] Transaction failed: ${errorMessage} (Code: ${errorCode})`);
  }
}

/**
 * Get the server timestamp (Sentinel value).
 * Wraps Firebase serverTimestamp to avoid direct dependency.
 */
export function serverTimestamp() {
  return fbServerTimestamp();
}
