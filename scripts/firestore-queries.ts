/**
 * Firebase Admin Firestore Queries
 * Query functions for reading Firestore data
 */

import * as admin from "firebase-admin";
import type { CollectionInfo } from "./types";

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
