/**
 * Firebase Admin Firestore Operations
 * Delete operations for Firestore data
 */

import * as admin from "firebase-admin";

const BATCH_SIZE = 500;

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
