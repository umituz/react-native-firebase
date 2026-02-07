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
      for (let i = 0; i < subcollectionSnapshot.docs.length; i += BATCH_SIZE) {
        const chunk = subcollectionSnapshot.docs.slice(i, i + BATCH_SIZE);
        const batch = db.batch();
        chunk.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        totalDeleted += chunk.length;
        onProgress?.(totalDeleted);
      }
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
            for (let i = 0; i < subSnapshot.docs.length; i += BATCH_SIZE) {
              const chunk = subSnapshot.docs.slice(i, i + BATCH_SIZE);
              const batch = db.batch();
              chunk.forEach((subDoc) => batch.delete(subDoc.ref));
              await batch.commit();
              totalDeleted += chunk.length;
            }
          }
        }
      }
    }

    // Delete main collection documents
    if (!snapshot.empty) {
      for (let i = 0; i < snapshot.docs.length; i += BATCH_SIZE) {
        const chunk = snapshot.docs.slice(i, i + BATCH_SIZE);
        const batch = db.batch();
        chunk.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        totalDeleted += chunk.length;
      }
      onProgress?.(collection.id, totalDeleted);
    }
  }

  return totalDeleted;
}
