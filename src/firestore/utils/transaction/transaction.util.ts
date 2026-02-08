/**
 * Transaction Utility
 * Utilities for executing Firestore transactions
 */

import {
  runTransaction as fbRunTransaction,
  serverTimestamp as fbServerTimestamp,
  type Transaction,
} from "firebase/firestore";
import { getDb } from "../firestore-helper";
import type { Firestore } from "../../infrastructure/config/FirestoreClient";

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
    return await fbRunTransaction(db as Firestore, updateFunction);
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
