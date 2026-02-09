/**
 * Transaction Utility
 * Utilities for executing Firestore transactions
 */

import {
  runTransaction as fbRunTransaction,
  serverTimestamp as fbServerTimestamp,
  type Transaction,
} from "firebase/firestore";
import { getFirestore } from "../../infrastructure/config/FirestoreClient";
import { hasCodeProperty } from "../../../domain/utils/type-guards.util";

/**
 * Execute a transaction with automatic DB instance check.
 * Wraps the Firebase runTransaction to ensure the DB is initialized.
 */
export async function runTransaction<T>(
  updateFunction: (transaction: Transaction) => Promise<T>
): Promise<T> {
  const db = getFirestore();
  if (!db) {
    throw new Error("[runTransaction] Firestore database is not initialized. Please ensure Firebase is properly initialized before running transactions.");
  }
  try {
    return await fbRunTransaction(db, updateFunction);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorCode = hasCodeProperty(error) ? error.code : 'unknown';

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
