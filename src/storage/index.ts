/**
 * Firebase Storage Module
 */

export type { UploadResult, UploadOptions, DeleteResult } from "./types";
export type { BatchDeleteResult } from "./deleter";
export { uploadBase64Image, uploadFile, getMimeType } from "./uploader";
export { deleteStorageFile, deleteStorageFiles } from "./deleter";
