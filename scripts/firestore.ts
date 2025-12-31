/**
 * Firebase Admin Firestore Utilities
 * Generic Firestore operations for admin scripts
 */

import * as admin from "firebase-admin";
import type { CollectionInfo, BatchResult } from "./types";

const BATCH_SIZE = 500;

/**
 * List all root-level collections
 */
export async function listCollections(
  db: admin.firestore.Firestore
): Promise<CollectionInfo[]> {
  const collections = await db.listCollections();
  const result: CollectionInfo[] = [];

  for (const collection of collections) {
    const snapshot = await collection.limit(1000).get();
    const info: CollectionInfo = {
      name: collection.id,
      documentCount: snapshot.docs.length,
      sampleDocumentId: snapshot.docs[0]?.id,
    };

    if (!snapshot.empty) {
      const subcollections = await snapshot.docs[0].ref.listCollections();
      info.hasSubcollections = subcollections.length > 0;
    }

    result.push(info);
  }

  return result.sort((a, b) => b.documentCount - a.documentCount);
}

/**
 * List subcollections for a user document
 */
export async function listUserSubcollections(
  db: admin.firestore.Firestore,
  userId: string
): Promise<CollectionInfo[]> {
  const userRef = db.collection("users").doc(userId);
  const subcollections = await userRef.listCollections();
  const result: CollectionInfo[] = [];

  for (const subcollection of subcollections) {
    const count = await subcollection.count().get();
    result.push({
      name: subcollection.id,
      documentCount: count.data().count,
    });
  }

  return result;
}

/**
 * Delete collection in batches
 */
export async function deleteCollection(
  db: admin.firestore.Firestore,
  collectionPath: string,
  onProgress?: (deleted: number) => void
): Promise<number> {
  let totalDeleted = 0;
  let hasMore = true;

  while (hasMore) {
    const snapshot = await db
      .collection(collectionPath)
      .orderBy("__name__")
      .limit(BATCH_SIZE)
      .get();

    if (snapshot.empty) {
      hasMore = false;
      continue;
    }

    const batch = db.batch();
    snapshot.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    totalDeleted += snapshot.docs.length;
    onProgress?.(totalDeleted);
  }

  return totalDeleted;
}

/**
 * Delete user subcollection for all users
 */
export async function deleteUserSubcollection(
  db: admin.firestore.Firestore,
  subcollectionName: string,
  onProgress?: (deleted: number) => void
): Promise<number> {
  let totalDeleted = 0;
  const usersSnapshot = await db.collection("users").get();

  for (const userDoc of usersSnapshot.docs) {
    const subcollectionRef = userDoc.ref.collection(subcollectionName);
    const subcollectionSnapshot = await subcollectionRef.get();

    if (!subcollectionSnapshot.empty) {
      const batch = db.batch();
      subcollectionSnapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      totalDeleted += subcollectionSnapshot.docs.length;
      onProgress?.(totalDeleted);
    }
  }

  return totalDeleted;
}

/**
 * Delete all Firestore data
 */
export async function deleteAllData(
  db: admin.firestore.Firestore,
  onProgress?: (collection: string, deleted: number) => void
): Promise<number> {
  let totalDeleted = 0;
  const collections = await db.listCollections();

  for (const collection of collections) {
    const snapshot = await collection.get();

    // Delete subcollections first for users collection
    if (collection.id === "users") {
      for (const doc of snapshot.docs) {
        const subcollections = await doc.ref.listCollections();
        for (const subcollection of subcollections) {
          const subSnapshot = await subcollection.get();
          if (!subSnapshot.empty) {
            const batch = db.batch();
            subSnapshot.docs.forEach((subDoc) => batch.delete(subDoc.ref));
            await batch.commit();
            totalDeleted += subSnapshot.docs.length;
          }
        }
      }
    }

    // Delete main collection documents
    if (!snapshot.empty) {
      const batch = db.batch();
      snapshot.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      totalDeleted += snapshot.docs.length;
      onProgress?.(collection.id, totalDeleted);
    }
  }

  return totalDeleted;
}

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

  const batch = db.batch();

  for (const { id, data } of docs) {
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
    result.processed = docs.length;
  } catch (error) {
    result.success = false;
    result.errors.push(`Failed to seed subcollection: ${error}`);
  }

  return result;
}

/**
 * Count documents in collection
 */
export async function countDocuments(
  db: admin.firestore.Firestore,
  collectionPath: string
): Promise<number> {
  const count = await db.collection(collectionPath).count().get();
  return count.data().count;
}

/**
 * Get user document count statistics
 */
export async function getUserStats(db: admin.firestore.Firestore): Promise<{
  total: number;
  anonymous: number;
  authenticated: number;
}> {
  const usersSnapshot = await db.collection("users").get();

  let anonymous = 0;
  let authenticated = 0;

  usersSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    if (data.isAnonymous) {
      anonymous++;
    } else {
      authenticated++;
    }
  });

  return {
    total: usersSnapshot.docs.length,
    anonymous,
    authenticated,
  };
}
