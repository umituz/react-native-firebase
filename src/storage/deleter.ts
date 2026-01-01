/**
 * Firebase Storage Deleter
 * Handles image deletion from Firebase Storage
 */

import { getStorage, ref, deleteObject } from "firebase/storage";
import { getFirebaseApp } from "../infrastructure/config/FirebaseClient";
import type { DeleteResult } from "./types";

declare const __DEV__: boolean;

/**
 * Extract storage path from Firebase download URL
 */
function extractStoragePath(downloadUrl: string): string | null {
    if (!downloadUrl.startsWith("https://")) {
        return downloadUrl;
    }

    try {
        const urlObj = new URL(downloadUrl);
        const pathMatch = urlObj.pathname.match(/\/o\/(.+)/);

        if (!pathMatch || !pathMatch[1]) {
            return null;
        }

        return decodeURIComponent(pathMatch[1]);
    } catch {
        return null;
    }
}

function getStorageInstance() {
    const app = getFirebaseApp();
    return app ? getStorage(app) : null;
}

/**
 * Delete image from Firebase Storage
 * Accepts either a download URL or storage path
 */
export async function deleteStorageFile(
    downloadUrlOrPath: string
): Promise<DeleteResult> {
    if (__DEV__) {
        console.log("[StorageDeleter] Deleting", { url: downloadUrlOrPath });
    }

    const storagePath = extractStoragePath(downloadUrlOrPath);

    if (!storagePath) {
        if (__DEV__) {
            console.error("[StorageDeleter] Invalid URL", {
                url: downloadUrlOrPath,
            });
        }
        return { success: false, storagePath: downloadUrlOrPath };
    }

    try {
        const storage = getStorageInstance();
        if (!storage) {
            throw new Error("Firebase Storage not initialized");
        }

        const storageRef = ref(storage, storagePath);
        await deleteObject(storageRef);

        if (__DEV__) {
            console.log("[StorageDeleter] Deleted successfully", {
                storagePath,
            });
        }

        return { success: true, storagePath };
    } catch {
        return { success: false, storagePath };
    }
}
