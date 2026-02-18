/**
 * Firebase Admin User Queries
 * Query functions for reading user data
 */

import * as admin from "firebase-admin";
import type { UserData, UserCredits } from "./types";

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
