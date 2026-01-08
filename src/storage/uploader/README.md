# Storage Uploader

Firebase Storage upload functionality supporting base64 images and file uploads from URIs.

## Purpose

Provides file upload capabilities to Firebase Storage with base64 image upload, URI upload, automatic MIME type detection, custom metadata support, and comprehensive error handling.

## For AI Agents

### Before Using Storage Uploader

1. **ALWAYS** use uploader functions (never Firebase Storage SDK directly)
2. **COMPRESS** images before upload (reduce bandwidth/storage)
3. **USE** organized storage paths (hierarchical structure)
4. **HANDLE** upload errors appropriately
5. **ADD** metadata for tracking and management

### Required Practices

1. **Use uploader functions** - Import from storage module
2. **Organize paths** - Use hierarchical structure (users/{userId}/...)
3. **Add metadata** - Attach custom metadata to uploads
4. **Compress images** - Reduce file size before upload
5. **Handle errors** - Show user-friendly error messages
6. **Use unique filenames** - Prevent overwrites

### Forbidden Practices

## ❌ NEVER

- Use Firebase Storage SDK directly in application code
- Upload without compression (images)
- Use flat storage structure
- Ignore upload errors
- Use predictable filenames (photo.jpg, avatar.jpg)
- Upload sensitive data without encryption

## ⚠️ Avoid

- Uploading large files without progress indication
- Not adding metadata to uploads
- Using sequential filenames
- Not organizing files hierarchically
- Ignoring MIME types

## Usage Strategies

### For Base64 Image Upload

**Strategy:** Use uploadBase64Image for camera/gallery photos.

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/uploader`

**When to Use:**
- Uploading photos from camera/gallery
- Base64 encoded image data
- Image picker returns base64
- Profile pictures, avatars

**Function:** `uploadBase64Image(base64, storagePath, options?)`

**Parameters:**
- `base64: string` - Base64 image data (with or without data URL prefix)
- `storagePath: string` - Destination path in Storage bucket
- `options?: UploadOptions` - Optional configuration (mimeType, customMetadata)

**Returns:** `Promise<UploadResult>`
- `downloadUrl: string` - Public download URL
- `storagePath: string` - Storage path

**Strategy:**
1. Compress image before upload
2. Generate unique filename (timestamp-based)
3. Organize path hierarchically
4. Add custom metadata
5. Handle errors appropriately

### For File Upload from URI

**Strategy:** Use uploadFile for file URIs (file://, content://).

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/uploader`

**When to Use:**
- File picker returns URI
- Document uploads
- Video files
- Files from device storage

**Function:** `uploadFile(uri, storagePath, options?)`

**Parameters:**
- `uri: string` - File URI (file://, content://, http://)
- `storagePath: string` - Destination path in Storage bucket
- `options?: UploadOptions` - Optional configuration

**Returns:** `Promise<UploadResult>`

**Strategy:**
1. Validate file URI
2. Check file size (limit large files)
3. Generate unique filename
4. Add metadata for tracking
5. Handle upload failures

### For MIME Type Detection

**Strategy:** Use getMimeType to detect content type from base64.

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/uploader`

**When to Use:**
- Auto-detect image type from base64
- Validate image format
- Set correct MIME type

**Function:** `getMimeType(base64): string`

**Supports:**
- `image/png` (data:image/png;base64,)
- `image/webp` (data:image/webp;base64,)
- `image/gif` (data:image/gif;base64,)
- `image/jpeg` (default)

**Strategy:**
1. Call getMimeType before upload
2. Use returned MIME type in options
3. Fallback to image/jpeg if unknown

### For Multiple File Upload

**Strategy:** Upload files sequentially with progress tracking.

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/uploader`

**When to Use:**
- Photo gallery uploads
- Batch document uploads
- Multiple file selection

**Implementation:**
1. Loop through files array
2. Upload each file with unique path
3. Track success/failure for each
4. Show progress to user
5. Return results array

**Batch Upload Strategy:**
- Upload sequentially (not parallel) - better error handling
- Track progress: `{ current: 3, total: 10 }`
- Collect failed uploads for retry
- Return detailed results

### For Profile Picture Upload

**Strategy:** Compress, upload, and update user profile.

**Import From:** `@umituz/react-native-firebase/storage` and auth/firestore

**When to Use:**
- User profile picture updates
- Avatar changes
- Image cropping/resizing needed

**Implementation Strategy:**
1. Compress image (max 1024x1024, quality 0.8)
2. Generate unique filename (avatar_timestamp.jpg)
3. Upload to users/{userId}/avatar/{filename}
4. Get download URL
5. Update Firestore user document
6. Delete old avatar if exists

### For Multiple Photos Upload

**Strategy:** Upload gallery photos with error handling.

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/uploader`

**When to Use:**
- Photo gallery creation
- Multiple image selection
- Batch photo uploads

**Implementation:**
1. Compress each image
2. Generate unique filenames
3. Upload to users/{userId}/photos/{filename}
4. Track each upload result
5. Return array of download URLs
6. Handle partial failures gracefully

## Storage Path Organization

### Path Strategy

**Import From:** Use in storagePath parameter

**Pattern:** Hierarchical structure with user-based organization

**User Files:**
- Avatar: `users/{userId}/avatar/avatar.jpg`
- Photos: `users/{userId}/photos/photo_{timestamp}.jpg`
- Documents: `users/{userId}/documents/{category}/{filename}.pdf`
- Temporary: `users/{userId}/temp/{timestamp}.jpg`

**Product Images:**
- Main: `products/{productId}/main.jpg`
- Gallery: `products/{productId}/gallery/{index}.jpg`
- Thumbnails: `products/{productId}/thumbnails/thumb.jpg`

**Content Files:**
- Posts: `content/posts/{postId}/featured.jpg`
- Videos: `content/videos/{videoId}/poster.jpg`
- Documents: `content/documents/{docId}/{filename}.pdf`

**Benefits:**
- Organized structure
- Easy to manage
- Simple user-based cleanup
- Clear ownership

## Metadata Strategy

### Custom Metadata

**Strategy:** Attach metadata for tracking and management.

**Import From:** Pass in UploadOptions

**Common Metadata:**
- `uploadedBy` - User ID who uploaded
- `originalFileName` - Original file name
- `type` - File type/category (avatar, document, etc.)
- `uploadedAt` - ISO timestamp
- `width` - Image width (for images)
- `height` - Image height (for images)
- `contentType` - Content description

**Usage:**
1. Create metadata object with key-value pairs
2. Pass in UploadOptions.customMetadata
3. Stored with file in Firebase Storage
4. Useful for audit trail and management

## Error Handling

### Common Errors

**Import From:** Handle errors from upload functions

**Error Types:**
- `NOT_INITIALIZED` - Firebase Storage not initialized
- `QUOTA_EXCEEDED` - Storage quota exceeded
- `UNAUTHORIZED` - User not authorized to upload
- `NETWORK_ERROR` - Network connection failed
- `INVALID_FILE` - Invalid file format or size

**Error Handling Strategy:**
1. Wrap upload in try-catch
2. Check error message for type
3. Return user-friendly error message
4. Log technical error for debugging
5. Provide retry option if appropriate

## Common Mistakes to Avoid

1. ❌ Not compressing images before upload
   - ✅ Always compress images (quality 0.8, max 1024x1024)

2. ❌ Using flat storage structure
   - ✅ Use hierarchical organization (users/{userId}/...)

3. ❌ Not adding metadata
   - ✅ Attach custom metadata to all uploads

4. ❌ Using predictable filenames
   - ✅ Use unique filenames (timestamp-based)

5. ❌ Not handling upload errors
   - ✅ Show user-friendly error messages

6. ❌ Uploading large files without optimization
   - ✅ Compress images and limit file sizes

## AI Agent Instructions

### When Uploading Single Image

1. Compress image before upload
2. Generate unique filename (timestamp or UUID)
3. Organize path hierarchically
4. Add metadata for tracking
5. Handle errors appropriately
6. Update database with download URL

### When Uploading Multiple Files

1. Loop through files array
2. Upload sequentially (not parallel)
3. Track success/failure for each file
4. Show progress to user
5. Return detailed results array
6. Handle partial failures gracefully

### When Organizing Storage Paths

1. Use hierarchical structure
2. Include user ID in path
3. Organize by file type/category
4. Use unique filenames
5. Keep paths consistent

### When Adding Metadata

1. Include uploadedBy (user ID)
2. Add upload timestamp
3. Include file type/category
4. Add original filename if available
5. Include image dimensions for photos

## Code Quality Standards

### TypeScript

- Use UploadResult type for return values
- Use UploadOptions for configuration
- Type all function parameters
- Handle errors properly

### File Naming

**Use These Patterns:**
- `avatar_{timestamp}.jpg`
- `photo_{index}_{timestamp}.jpg`
- `document_{uuid}.pdf`
- `{type}_{userId}_{timestamp}.jpg`

**Avoid These Patterns:**
- `avatar.jpg` (not unique)
- `photo1.jpg, photo2.jpg` (predictable)
- `user_avatar.jpg` (no timestamp)

### Error Handling

- Always wrap uploads in try-catch
- Return user-friendly error messages
- Log technical errors for debugging
- Provide retry option when appropriate

## Performance Considerations

### Image Compression

**Before Upload:**
- Resize to max 1024x1024 pixels
- Compress to JPEG quality 0.8
- Use expo-image-manipulator or similar
- Reduces bandwidth and storage costs

### Batch Uploads

**Sequential vs Parallel:**
- Upload sequentially for better error handling
- Parallel uploads faster but harder to track
- Recommend sequential for most cases
- Use parallel only for small batches (< 5 files)

### Storage Costs

**Optimization:**
- Compress images before upload
- Use appropriate image formats
- Delete old/unused files
- Monitor storage usage

## Related Documentation

- [Storage Module README](../README.md)
- [Storage Deleter README](../deleter/README.md)
- [Storage Types README](../types/README.md)
- [Firestore README](../../firestore/README.md)

## API Reference

### Main Functions

**Import Path:** `@umituz/react-native-firebase/storage` or `src/storage/uploader`

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `uploadBase64Image` | base64, storagePath, options? | `Promise<UploadResult>` | Upload base64 image |
| `uploadFile` | uri, storagePath, options? | `Promise<UploadResult>` | Upload file from URI |
| `getMimeType` | base64 | `string` | Detect MIME type |

### Type Definitions

**UploadResult:**
- `downloadUrl: string` - Public download URL
- `storagePath: string` - Storage path

**UploadOptions:**
- `mimeType?: string` - Content type (auto-detected for base64)
- `customMetadata?: Record<string, string>` - Custom metadata

---

**Last Updated:** 2025-01-08
**Maintainer:** Storage Module Team
