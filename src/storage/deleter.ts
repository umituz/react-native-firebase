/**
 * Firebase Storage Deleter
 * Handles single and batch deletion from Firebase Storage
 */

import { ref, deleteObject } from "firebase/storage";
import { getStorageInstance } from "./storage-instance";
import type { DeleteResult } from "./types";

declare const __DEV__: boolean;

/**
 * Batch delete result interface
 */
export interface BatchDeleteResult {
    successful: string[];
    failed: Array<{ path: string; error: string }>;
}

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
    } catch (error) {
        if (__DEV__) {
            console.error("[StorageDeleter] Delete failed", {
                storagePath,
                error,
            });
        }
        return { success: false, storagePath };
    }
}

/**
 * Delete multiple files from Firebase Storage
 * Processes deletions in parallel for better performance
 *
 * @param urlsOrPaths - Array of download URLs or storage paths
 * @returns Batch delete result with successful and failed deletions
 */
export async function deleteStorageFiles(
    urlsOrPaths: string[]
): Promise<BatchDeleteResult> {
    if (__DEV__) {
        console.log("[StorageDeleter] Batch delete", { count: urlsOrPaths.length });
    }

    const storage = getStorageInstance();
    if (!storage) {
        return {
            successful: [],
            failed: urlsOrPaths.map((path) => ({
                path,
                error: "Firebase Storage not initialized",
            })),
        };
    }

    const results = await Promise.allSettled(
        urlsOrPaths.map((urlOrPath) => deleteStorageFile(urlOrPath))
    );

    const successful: string[] = [];
    const failed: Array<{ path: string; error: string }> = [];

    results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value.success) {
            successful.push(result.value.storagePath);
        } else {
            const errorMessage = result.status === "rejected"
                ? String((result.reason as any)?.message ?? "Unknown error")
                : "Delete operation failed";
            failed.push({ path: urlsOrPaths[index]!, error: errorMessage });
        }
    });

    if (__DEV__) {
        console.log("[StorageDeleter] Batch delete complete", {
            successful: successful.length,
            failed: failed.length,
        });
    }

    return { successful, failed };
}
