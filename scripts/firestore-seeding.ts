/**
 * Firebase Admin Firestore Seeding
 * Seed operations for Firestore data
 */

import * as admin from "firebase-admin";
import type { BatchResult } from "./types";

const BATCH_SIZE = 500;

/**
 * Seed documents in batches
 */
export async function seedBatch(
  db: admin.firestore.Firestore,
  collectionPath: string,
  docs: Array<{ id: string; data: Record<string, unknown> }>
): Promise<BatchResult> {
  const result: BatchResult = {
    success: true,
    processed: 0,
    errors: [],
  };

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const slice = docs.slice(i, i + BATCH_SIZE);

    for (const { id, data } of slice) {
      const ref = db.collection(collectionPath).doc(id);
      const clean = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined)
      );
      batch.set(ref, clean);
    }

    try {
      await batch.commit();
      result.processed += slice.length;
    } catch (error) {
      result.success = false;
      result.errors.push(`Batch failed at index ${i}: ${error}`);
    }
  }

  return result;
}

/**
 * Seed user subcollection
 */
export async function seedUserSubcollection(
  db: admin.firestore.Firestore,
  userId: string,
  subcollectionName: string,
  docs: Array<{ id: string; data: Record<string, unknown> }>
): Promise<BatchResult> {
  const result: BatchResult = {
    success: true,
    processed: 0,
    errors: [],
  };

  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const slice = docs.slice(i, i + BATCH_SIZE);
    const batch = db.batch();

    for (const { id, data } of slice) {
      const ref = db
        .collection("users")
        .doc(userId)
        .collection(subcollectionName)
        .doc(id);
      const clean = Object.fromEntries(
        Object.entries(data).filter(([, v]) => v !== undefined)
      );
      batch.set(ref, clean);
    }

    try {
      await batch.commit();
      result.processed += slice.length;
    } catch (error) {
      result.success = false;
      result.errors.push(`Failed to seed subcollection at index ${i}: ${error}`);
    }
  }

  return result;
}
