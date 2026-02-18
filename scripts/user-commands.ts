/**
 * Firebase Admin User Commands
 * Command functions for modifying user data
 */

import * as admin from "firebase-admin";
import type { UserCredits, CreditsConfig } from "./types";

/**
 * Initialize credits for a user
 */
export async function initializeUserCredits(
  db: admin.firestore.Firestore,
  userId: string,
  config: CreditsConfig
): Promise<UserCredits> {
  const { collectionName = "user_credits", textLimit = 0, imageLimit = 0 } = config;

  const now = admin.firestore.FieldValue.serverTimestamp();

  const credits: Omit<UserCredits, "createdAt" | "updatedAt"> & {
    createdAt: admin.firestore.FieldValue;
    updatedAt: admin.firestore.FieldValue;
  } = {
    text: textLimit,
    image: imageLimit,
    video: 0,
    audio: 0,
    createdAt: now,
    updatedAt: now,
  };

  await db.collection(collectionName).doc(userId).set(credits, { merge: true });

  return {
    text: textLimit,
    image: imageLimit,
    video: 0,
    audio: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Add credits to a user
 */
export async function addUserCredits(
  db: admin.firestore.Firestore,
  userId: string,
  credits: { text?: number; image?: number; video?: number; audio?: number },
  collectionName = "user_credits"
): Promise<void> {
  const updates: Record<string, admin.firestore.FieldValue> = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (credits.text !== undefined) {
    updates.text = admin.firestore.FieldValue.increment(credits.text);
  }
  if (credits.image !== undefined) {
    updates.image = admin.firestore.FieldValue.increment(credits.image);
  }
  if (credits.video !== undefined) {
    updates.video = admin.firestore.FieldValue.increment(credits.video);
  }
  if (credits.audio !== undefined) {
    updates.audio = admin.firestore.FieldValue.increment(credits.audio);
  }

  await db.collection(collectionName).doc(userId).update(updates);
}

/**
 * Set credits for a user (overwrite)
 */
export async function setUserCredits(
  db: admin.firestore.Firestore,
  userId: string,
  credits: { text?: number; image?: number; video?: number; audio?: number },
  collectionName = "user_credits"
): Promise<void> {
  const updates: Record<string, unknown> = {
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  if (credits.text !== undefined) updates.text = credits.text;
  if (credits.image !== undefined) updates.image = credits.image;
  if (credits.video !== undefined) updates.video = credits.video;
  if (credits.audio !== undefined) updates.audio = credits.audio;

  await db.collection(collectionName).doc(userId).set(updates, { merge: true });
}

/**
 * Delete user credits document
 */
export async function deleteUserCredits(
  db: admin.firestore.Firestore,
  userId: string,
  collectionName = "user_credits"
): Promise<void> {
  await db.collection(collectionName).doc(userId).delete();
}
