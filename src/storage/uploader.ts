/**
 * Firebase Storage Uploader
 * Uses fetch().blob() pattern for React Native compatibility
 */

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
    type UploadMetadata,
} from "firebase/storage";
import { getFirebaseApp } from "../infrastructure/config/FirebaseClient";

declare const __DEV__: boolean;

export interface UploadResult {
    downloadUrl: string;
    storagePath: string;
    metadata?: any;
}

export interface UploadOptions {
    mimeType?: string;
    metadata?: any;
}

/**
 * Extract MIME type from base64 data URL or return default
 */
export function getMimeType(base64: string): string {
    if (base64.startsWith("data:image/png")) return "image/png";
    if (base64.startsWith("data:image/webp")) return "image/webp";
    if (base64.startsWith("data:image/gif")) return "image/gif";
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

function getStorageInstance() {
    const app = getFirebaseApp();
    return app ? getStorage(app) : null;
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
        customMetadata: options?.metadata,
    };

    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadUrl = await getDownloadURL(storageRef);

    return {
        downloadUrl,
        storagePath,
        metadata: snapshot.metadata,
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

    const metadata: UploadMetadata = {
        contentType: options?.mimeType ?? "image/jpeg",
        customMetadata: options?.metadata,
    };

    const snapshot = await uploadBytes(storageRef, blob, metadata);
    const downloadUrl = await getDownloadURL(storageRef);

    return {
        downloadUrl,
        storagePath,
        metadata: snapshot.metadata,
    };
}
