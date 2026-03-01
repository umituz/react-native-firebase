/**
 * User Document Service
 * Generic service for creating/updating user documents in Firestore
 */

import { doc, getDoc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { getFirestore } from "../../../firestore";
import type {
  UserDocumentUser,
  UserDocumentConfig,
  UserDocumentExtras,
} from "./user-document.types";
import {
  getSignUpMethod,
  buildBaseData,
  buildCreateData,
  buildUpdateData,
  buildLoginHistoryEntry,
} from "./user-document-builder.util";

declare const __DEV__: boolean;

let userDocumentConfig: UserDocumentConfig = {};

export function configureUserDocumentService(config: UserDocumentConfig): void {
  userDocumentConfig = { ...config };
}

export async function ensureUserDocument(
  user: UserDocumentUser | User,
  extras?: UserDocumentExtras,
): Promise<boolean> {
  const db = getFirestore();
  if (!db || !user.uid) return false;

  try {
    let allExtras = extras || {};
    if (userDocumentConfig.collectExtras) {
      const collectedExtras = await userDocumentConfig.collectExtras();
      allExtras = { ...collectedExtras, ...allExtras };
    }

    if (!allExtras.signUpMethod) allExtras.signUpMethod = getSignUpMethod(user);

    const collectionName = userDocumentConfig.collectionName || "users";
    const userRef = doc(db, collectionName, user.uid);
    const userDoc = await getDoc(userRef);
    const baseData = buildBaseData(user, allExtras);

    const docData = !userDoc.exists()
      ? buildCreateData(baseData, userDocumentConfig.extraFields, allExtras)
      : buildUpdateData(baseData, allExtras);

    await setDoc(userRef, docData, { merge: true });

    // Write login history entry (fire-and-forget)
    const historyEntry = buildLoginHistoryEntry(user, allExtras);
    const historyRef = collection(db, collectionName, user.uid, "loginHistory");
    addDoc(historyRef, historyEntry).catch((err) => {
      if (typeof __DEV__ !== "undefined" && __DEV__) {
        console.warn("[UserDocumentService] Failed to write login history:", err);
      }
    });

    return true;
  } catch (error) {
    if (typeof __DEV__ !== "undefined" && __DEV__) {
      console.error("[UserDocumentService] Failed:", error);
    }
    return false;
  }
}

export async function markUserDeleted(userId: string): Promise<boolean> {
  const db = getFirestore();
  if (!db || !userId) return false;

  try {
    const userRef = doc(db, userDocumentConfig.collectionName || "users", userId);
    await setDoc(userRef, {
      isDeleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    return true;
  } catch {
    return false;
  }
}
