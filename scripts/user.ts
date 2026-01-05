/**
 * Firebase Admin User Utilities
 * Read and manage user data including credits, subscriptions, transactions
 */

import * as admin from "firebase-admin";
import type { UserData, UserCredits, CreditsConfig } from "./types";

/**
 * Get complete user data including profile and all related collections
 */
export async function getUserData(
  db: admin.firestore.Firestore,
  userId: string,
  options?: {
    includeCredits?: boolean;
    includeSubscriptions?: boolean;
    includeTransactions?: boolean;
    creditsCollection?: string;
  }
): Promise<UserData> {
  const {
    includeCredits = true,
    includeSubscriptions = true,
    includeTransactions = true,
    creditsCollection = "user_credits",
  } = options || {};

  const result: UserData = {
    userId,
    exists: false,
    profile: null,
    credits: null,
    subscriptions: [],
    transactions: [],
  };

  // Get user profile
  const userDoc = await db.collection("users").doc(userId).get();
  if (userDoc.exists) {
    result.exists = true;
    result.profile = userDoc.data() as Record<string, unknown>;
  }

  // Get credits from root-level collection
  if (includeCredits) {
    const creditsDoc = await db.collection(creditsCollection).doc(userId).get();
    if (creditsDoc.exists) {
      result.credits = creditsDoc.data() as UserCredits;
    }
  }

  // Get subscriptions subcollection
  if (includeSubscriptions) {
    const subsSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("subscriptions")
      .get();
    result.subscriptions = subsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Get transactions subcollection
  if (includeTransactions) {
    const txSnapshot = await db
      .collection("users")
      .doc(userId)
      .collection("transactions")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();
    result.transactions = txSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  return result;
}

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

  if (credits.text) {
    updates.text = admin.firestore.FieldValue.increment(credits.text);
  }
  if (credits.image) {
    updates.image = admin.firestore.FieldValue.increment(credits.image);
  }
  if (credits.video) {
    updates.video = admin.firestore.FieldValue.increment(credits.video);
  }
  if (credits.audio) {
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
 * List all users with their credit balances
 */
export async function listUsersWithCredits(
  db: admin.firestore.Firestore,
  options?: {
    creditsCollection?: string;
    limit?: number;
    onlyWithCredits?: boolean;
  }
): Promise<
  Array<{
    userId: string;
    displayName?: string;
    email?: string;
    isAnonymous: boolean;
    credits: UserCredits | null;
  }>
> {
  const { creditsCollection = "user_credits", limit = 100, onlyWithCredits = false } = options || {};

  const usersSnapshot = await db.collection("users").limit(limit).get();
  const result: Array<{
    userId: string;
    displayName?: string;
    email?: string;
    isAnonymous: boolean;
    credits: UserCredits | null;
  }> = [];

  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    const creditsDoc = await db.collection(creditsCollection).doc(userDoc.id).get();
    const credits = creditsDoc.exists ? (creditsDoc.data() as UserCredits) : null;

    if (onlyWithCredits && !credits) continue;

    result.push({
      userId: userDoc.id,
      displayName: userData.displayName,
      email: userData.email,
      isAnonymous: userData.isAnonymous || false,
      credits,
    });
  }

  return result;
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

/**
 * Get credits summary across all users
 */
export async function getCreditsSummary(
  db: admin.firestore.Firestore,
  collectionName = "user_credits"
): Promise<{
  totalUsers: number;
  totalText: number;
  totalImage: number;
  totalVideo: number;
  totalAudio: number;
  usersWithCredits: number;
  usersWithZeroCredits: number;
}> {
  const snapshot = await db.collection(collectionName).get();

  let totalText = 0;
  let totalImage = 0;
  let totalVideo = 0;
  let totalAudio = 0;
  let usersWithCredits = 0;
  let usersWithZeroCredits = 0;

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const text = data.text || 0;
    const image = data.image || 0;
    const video = data.video || 0;
    const audio = data.audio || 0;

    totalText += text;
    totalImage += image;
    totalVideo += video;
    totalAudio += audio;

    if (text > 0 || image > 0 || video > 0 || audio > 0) {
      usersWithCredits++;
    } else {
      usersWithZeroCredits++;
    }
  });

  return {
    totalUsers: snapshot.docs.length,
    totalText,
    totalImage,
    totalVideo,
    totalAudio,
    usersWithCredits,
    usersWithZeroCredits,
  };
}

/**
 * Print user data in formatted way
 */
export function printUserData(data: UserData): void {
  console.log("\n" + "═".repeat(60));
  console.log(`👤 USER: ${data.userId}`);
  console.log("═".repeat(60));

  console.log("\n📋 PROFILE:");
  if (data.profile) {
    console.log(JSON.stringify(data.profile, null, 2));
  } else {
    console.log("  ❌ Not found");
  }

  console.log("\n💰 CREDITS:");
  if (data.credits) {
    console.log(`  Text:  ${data.credits.text || 0}`);
    console.log(`  Image: ${data.credits.image || 0}`);
    console.log(`  Video: ${data.credits.video || 0}`);
    console.log(`  Audio: ${data.credits.audio || 0}`);
  } else {
    console.log("  ❌ Not found");
  }

  console.log("\n🔔 SUBSCRIPTIONS:");
  if (data.subscriptions.length > 0) {
    data.subscriptions.forEach((sub) => {
      console.log(`  - ${sub.id}: ${JSON.stringify(sub)}`);
    });
  } else {
    console.log("  ❌ None");
  }

  console.log("\n🧾 TRANSACTIONS:");
  if (data.transactions.length > 0) {
    data.transactions.slice(0, 5).forEach((tx) => {
      console.log(`  - ${tx.id}: ${JSON.stringify(tx)}`);
    });
    if (data.transactions.length > 5) {
      console.log(`  ... and ${data.transactions.length - 5} more`);
    }
  } else {
    console.log("  ❌ None");
  }

  console.log("\n" + "═".repeat(60) + "\n");
}
