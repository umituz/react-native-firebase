# Storage Module

Firebase Storage module providing file upload and deletion operations with automatic MIME type detection and metadata support.

## Purpose

Provides clean, maintainable file upload and deletion operations for Firebase Storage with proper error handling, metadata management, and path organization.

## For AI Agents

### Before Using This Module

1. **READ** this entire README
2. **UNDERSTAND** path organization strategies
3. **ALWAYS** clean up old files before uploading new ones
4. **USE** organized path structures
5. **HANDLE** errors appropriately

### Required Practices

1. **Clean up old files** before uploading replacements
2. **Use organized path structures** (e.g., `users/{userId}/avatar.jpg`)
3. **Add metadata** to files for tracking
4. **Handle upload/delete errors** appropriately
5. **Use batch deletion** for multiple files

### Forbidden Practices

## ❌ NEVER

- Upload new files without deleting old ones (wastes storage)
- Use disorganized path structures
- Ignore upload/delete errors
- Store files at root level
- Hardcode storage paths
- Forget to add metadata for tracking

## ⚠️ Avoid

- Large file uploads without compression
- Uploading temporary files without cleanup
- Inconsistent path naming
- Missing error handling
- Not setting Firebase Storage security rules

## 🏗️ Architecture

**Directory Structure:**

- **uploader/** - Upload operations (Base64 and file uploads)
- **deleter/** - Delete operations (Single and batch deletions)
- **types/** - Type definitions (Storage interfaces and types)

## ✅ Required Practices

### Path Organization

**Strategy:** Use hierarchical, organized paths for all files.

**Path Pattern:**
- User files: `users/{userId}/{category}/{filename}`
- Post files: `posts/{postId}/{category}/{filename}`
- Product files: `products/{productId}/{category}/{filename}`

**Why Organized Paths:**
- Easy to manage and delete
- Clear file ownership
- Simple security rules
- Efficient cleanup

**Examples:**
- users/user123/avatar.jpg
- users/user123/photos/photo_2024-01-15.jpg
- posts/post456/images/image1.jpg
- products/prod789/thumbnails/thumb.jpg

### File Cleanup

**Strategy:** Always delete old files before uploading replacements.

**When to Clean Up:**
- Uploading new avatar (delete old avatar)
- Replacing product images
- Updating post attachments
- User deletes their content

**Approach:**
1. Store storage path in database (not download URL)
2. Before uploading new file, delete old one
3. Handle deletion errors appropriately
4. Verify deletion success

### Metadata Strategy

**Strategy:** Attach useful metadata to all uploads.

**Required Metadata:**
- `uploadedBy` - User ID who uploaded
- `uploadedAt` - ISO timestamp
- `originalName` - Original filename
- `contentType` - MIME type

**Optional Metadata:**
- Category or tags
- Related document IDs
- File dimensions (for images)
- Custom application fields

### Error Handling

**Required Error Handling:**
1. Handle network failures
2. Handle quota exceeded
3. Handle unauthorized access
4. Handle invalid files
5. Log errors appropriately

## 🎯 Usage Strategies

### For Avatar Upload

**Strategy:** Replace old avatar with new one.

**When to Use:**
- User updates profile picture
- Initial avatar upload

**Approach:**
1. Pick image from gallery/camera
2. Convert to base64
3. Delete old avatar if exists
4. Upload new avatar
5. Save storage path to database
6. Handle errors

**Path Pattern:** `users/{userId}/avatar.jpg`

### For Multiple Photos

**Strategy:** Upload multiple photos with organized paths.

**When to Use:**
- Photo gallery uploads
- Batch image uploads
- Album creation

**Approach:**
1. Generate unique storage path for each photo
2. Upload in parallel or sequence
3. Collect all results
4. Save paths to database
5. Handle partial failures

**Path Pattern:** `users/{userId}/photos/{timestamp}_{index}.jpg`

### For Product Images

**Strategy:** Organize by product with thumbnails.

**When to Use:**
- E-commerce applications
- Product catalog management
- Image gallery per product

**Approach:**
1. Main images: `products/{productId}/images/{filename}`
2. Thumbnails: `products/{productId}/thumbnails/{filename}`
3. Upload main image first
4. Generate and upload thumbnail
5. Save both paths to database

### For Document Upload

**Strategy:** Upload documents with proper metadata.

**When to Use:**
- PDF reports
- Document storage
- File attachments

**Approach:**
1. Use uploadFile for URI-based uploads
2. Provide explicit MIME type
3. Add descriptive metadata
4. Organize by category/date
5. Implement access control

**Path Pattern:** `documents/{userId}/{category}/{filename}.pdf`

## 🔧 Upload Operations

### Base64 Image Upload

**Function:** `uploadBase64Image(base64, storagePath, options?)`

**When to Use:**
- Images from camera/gallery (with base64)
- Profile pictures
- Small to medium images

**Features:**
- Automatic MIME type detection
- Data URL prefix support
- Custom metadata attachment
- Error handling

**Supported Types:**
- JPEG (image/jpeg)
- PNG (image/png)
- WebP (image/webp)
- GIF (image/gif)

### File Upload

**Function:** `uploadFile(uri, storagePath, options?)`

**When to Use:**
- Files from file pickers
- Document uploads
- Large files
- Video uploads

**Supported URI Schemes:**
- `file://` - File system URIs
- `content://` - Android content URIs
- `http://` - Remote files

**Upload Options:**
- `mimeType` - Explicit MIME type (recommended for non-images)
- `customMetadata` - Custom key-value pairs

## 🗑️ Deletion Operations

### Single File Deletion

**Function:** `deleteStorageFile(downloadUrlOrPath)`

**When to Use:**
- Deleting user profile picture
- Removing post attachments
- Cleaning up old files

**Accepts:**
- Full download URL
- Storage path only

**Returns:**
- `success` - Deletion status
- `storagePath` - Deleted file path

**Strategy:**
- Always store storage path in database
- Use path for deletion (not URL)
- Handle deletion errors

### Batch Deletion

**Function:** `deleteStorageFiles(urlsOrPaths[])`

**When to Use:**
- Deleting album/photos
- Cleaning up multiple files
- Batch operations

**Returns:**
- `successful` - Array of deleted paths
- `failed` - Array of failed deletions with errors

**Strategy:**
- More efficient than individual deletions
- Handle partial failures
- Log failed deletions
- Verify all critical files deleted

## 🤖 AI Agent Instructions

### When Implementing Upload

1. Organize paths by category (users, posts, products)
2. Delete old file before uploading replacement
3. Add metadata for tracking
4. Handle network errors
5. Show loading state to user
6. Verify upload success

### When Implementing Deletion

1. Store storage path in database (not URL)
2. Delete before uploading replacement
3. Use batch deletion for multiple files
4. Handle errors gracefully
5. Inform user of failures
6. Log deletion errors

### When Organizing Paths

1. Use hierarchical structure
2. Include user/resource ID in path
3. Use descriptive category names
4. Include timestamp or unique identifier
5. Keep paths consistent
6. Document path patterns

## 📏 Code Quality Standards

### File Size

- **Maximum:** 200 lines per file
- **Strategy:** Split upload/delete logic into separate files
- **Current:** uploader/index.ts, deleter/index.ts

### TypeScript

- Use strict mode
- Define proper types for all functions
- Export types used by other modules
- Never use `any` type

### Naming Conventions

- Files: `kebab-case.ts`
- Functions: `camelCase`
- Interfaces/Types: `PascalCase`
- Storage paths: `kebab-case` with underscores

### Error Handling

1. Always try-catch upload operations
2. Handle Firebase Storage errors
3. Provide user-friendly error messages
4. Log errors for debugging
5. Never ignore errors

## 🚨 Common Mistakes to Avoid

1. ❌ Not deleting old files before uploading new ones
   - ✅ Always delete old file first

2. ❌ Storing download URLs in database
   - ✅ Store storage paths instead

3. ❌ Disorganized path structure
   - ✅ Use hierarchical organized paths

4. ❌ Missing metadata on uploads
   - ✅ Always add tracking metadata

5. ❌ Not handling upload errors
   - ✅ Wrap in try-catch and show error to user

6. ❌ Using root-level storage paths
   - ✅ Organize by user/resource/category

## 🔐 Security Rules Guidance

### Basic User Path Security

**Path Pattern:** `users/{userId}/{allPaths=**}`

**Rules:**
- Allow read: Public (all users can read)
- Allow write: Only authenticated user matching userId in path

**Implementation Location:** Firebase Console → Storage → Rules

### Product Path Security

**Path Pattern:** `products/{productId}/{allPaths=**}`

**Rules:**
- Allow read: Public (all users can read)
- Allow write: Authenticated users only

**Implementation Location:** Firebase Console → Storage → Rules

### Key Security Principles

1. **Validate user ID** - Match request.auth.uid to path
2. **Validate file types** - Check MIME type in metadata
3. **Validate file size** - Limit upload size
4. **Public reads** - Allow public read for images
5. **Authenticated writes** - Require authentication for writes

## 📊 Performance Considerations

### Upload Optimization

- **Compress images** before uploading
- **Limit file sizes** (recommend <5MB for mobile)
- **Use progressive encoding** for large images
- **Show upload progress** to users
- **Implement retry logic** for failed uploads

### Storage Cost Management

- **Delete old files** to reduce storage costs
- **Use lifecycle policies** for automatic cleanup
- **Compress images** before upload
- **Monitor storage usage** regularly
- **Set appropriate file size limits**

## 📚 Related Documentation

- [Development Guidelines](../../CONTRIBUTING.md)
- [Firebase Storage Documentation](https://firebase.google.com/docs/storage)
- [Storage Security Rules](https://firebase.google.com/docs/storage/security/start)

## 🔗 API Reference

### Upload Functions

| Function | Description | Return Type |
|----------|-------------|-------------|
| `uploadBase64Image(base64, path, options?)` | Upload base64 image | `Promise<UploadResult>` |
| `uploadFile(uri, path, options?)` | Upload file from URI | `Promise<UploadResult>` |
| `getMimeType(base64)` | Detect MIME type | `string` |

### Delete Functions

| Function | Description | Return Type |
|----------|-------------|-------------|
| `deleteStorageFile(urlOrPath)` | Delete single file | `Promise<DeleteResult>` |
| `deleteStorageFiles(urlsOrPaths[])` | Delete multiple files | `Promise<BatchDeleteResult>` |

### Types

**UploadResult**
- `downloadUrl` - Public download URL
- `storagePath` - Internal storage path

**UploadOptions**
- `mimeType` - Content type (auto-detected for base64 images)
- `customMetadata` - Key-value pairs for tracking

**DeleteResult**
- `success` - Deletion status
- `storagePath` - Deleted file path

**BatchDeleteResult**
- `successful` - Array of deleted paths
- `failed` - Array of failed deletions with path and error

## 🎓 Key Concepts

### Why Clean Up Old Files?

**Storage Costs:**
- Firebase Storage charges by GB stored
- Old files waste money
- Accumulated files increase costs over time

**Performance:**
- Fewer files = faster listings
- Reduced clutter
- Easier management

**User Experience:**
- Avoid broken references
- Prevent stale content
- Keep data fresh

### Why Use Storage Paths Not URLs?

**Paths:**
- Stable and permanent
- Work across environments
- Can generate URL when needed
- Smaller database storage

**URLs:**
- May contain tokens
- Environment-specific
- Larger storage requirement
- Can change

### Why Add Metadata?

**Tracking:**
- Who uploaded the file
- When it was uploaded
- What the original filename was
- File type and category

**Management:**
- Easy to identify files
- Can filter by metadata
- Audit trail
- Debugging support

---

**Last Updated:** 2025-01-08
**Maintainer:** Storage Module Team
