/**
 * Firebase Storage Uploader
 * Uses fetch().blob() pattern for React Native compatibility
 */

import {
    ref,
    uploadBytes,
    getDownloadURL,
    type UploadMetadata,
} from "firebase/storage";
import { getStorageInstance } from "./storage-instance";
import type { UploadResult, UploadOptions } from "./types";

/**
 * Extract MIME type from base64 data URL or return default
 */
export function getMimeType(base64: string): string {
    if (base64.startsWith("data:image/jpeg") || base64.startsWith("data:image/jpg")) return "image/jpeg";
    if (base64.startsWith("data:image/png")) return "image/png";
    if (base64.startsWith("data:image/webp")) return "image/webp";
    if (base64.startsWith("data:image/gif")) return "image/gif";
    if (__DEV__) {
        console.warn("[StorageUploader] Could not detect MIME type from base64 prefix, falling back to image/jpeg");
    }
    return "image/jpeg";
}

/**
 * Ensure base64 has data URL prefix
 */
function ensureDataUrl(base64: string, mimeType: string): string {
    if (base64.startsWith("data:")) {
        return base64;
    }
    return `data:${mimeType};base64,${base64}`;
}

/**
 * Upload base64 image to Firebase Storage
 */
export async function uploadBase64Image(
    base64: string,
    storagePath: string,
    options?: UploadOptions
): Promise<UploadResult> {
    const mimeType = options?.mimeType ?? getMimeType(base64);
    const dataUrl = ensureDataUrl(base64, mimeType);

    if (__DEV__) {
        console.log("[StorageUploader] Starting base64 upload", {
            storagePath,
            mimeType,
        });
    }

    const storage = getStorageInstance();
    if (!storage) {
        throw new Error("Firebase Storage not initialized");
    }
    const storageRef = ref(storage, storagePath);

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    const metadata: UploadMetadata = {
        contentType: mimeType,
        customMetadata: options?.customMetadata,
    };

    await uploadBytes(storageRef, blob, metadata);
    const downloadUrl = await getDownloadURL(storageRef);

    if (__DEV__) {
        console.log("[StorageUploader] Upload complete", {
            storagePath,
            downloadUrl,
        });
    }

    return {
        downloadUrl,
        storagePath,
    };
}

/**
 * Upload file from URI (file:// or content://)
 */
export async function uploadFile(
    uri: string,
    storagePath: string,
    options?: UploadOptions
): Promise<UploadResult> {
    if (__DEV__) {
        console.log("[StorageUploader] Starting file upload", {
            uri,
            storagePath,
        });
    }

    const storage = getStorageInstance();
    if (!storage) {
        throw new Error("Firebase Storage not initialized");
    }
    const storageRef = ref(storage, storagePath);

    const response = await fetch(uri);
    const blob = await response.blob();

    const contentType = options?.mimeType ?? "image/jpeg";
    if (!options?.mimeType && __DEV__) {
        console.warn("[StorageUploader] No MIME type provided for file upload, falling back to image/jpeg");
    }
    const metadata: UploadMetadata = {
        contentType,
        customMetadata: options?.customMetadata,
    };

    await uploadBytes(storageRef, blob, metadata);
    const downloadUrl = await getDownloadURL(storageRef);

    if (__DEV__) {
        console.log("[StorageUploader] Upload complete", {
            storagePath,
            downloadUrl,
        });
    }

    return {
        downloadUrl,
        storagePath,
    };
}
