# Storage Deleter

Firebase Storage deletion functionality supporting single file and batch deletion operations.

## Purpose

Provides file deletion capabilities for Firebase Storage with single file deletion, batch deletion operations, URL/path parsing, and comprehensive error handling/reporting.

## For AI Agents

### Before Using Storage Deleter

1. **ALWAYS** use deleter functions (never Firebase Storage SDK directly)
2. **TRACK** file paths in database for cleanup
3. **USE** batch deletion for multiple files
4. **HANDLE** deletion errors appropriately
5. **VERIFY** file paths before deletion

### Required Practices

1. **Use deleter functions** - Import from storage module
2. **Track file paths** - Store paths in Firestore database
3. **Use batch deletion** - Delete multiple files efficiently
4. **Handle partial failures** - Some files may fail to delete
5. **Check deletion results** - Verify success/failure
6. **Clean up old files** - Remove unused files regularly

### Forbidden Practices

## ❌ NEVER

- Use Firebase Storage SDK directly in application code
- Delete files without tracking paths
- Ignore deletion failures
- Delete files based on URL patterns (unreliable)
- Assume deletion always succeeds
- Delete without user confirmation (for user-initiated actions)

## ⚠️ Avoid

- Sequential single deletes (use batch instead)
- Not tracking deleted files
- Deleting without verification
- Not cleaning up temporary files
- Ignoring partial batch failures

## Usage Strategies

### For Single File Deletion

**Strategy:** Use deleteStorageFile for individual file deletion.

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/deleter`

**When to Use:**
- Deleting single file (avatar, document)
- Replacing old file with new
- User-initiated deletion
- Temporary file cleanup

**Function:** `deleteStorageFile(downloadUrlOrPath)`

**Parameters:**
- `downloadUrlOrPath: string` - Download URL or storage path

**Returns:** `Promise<DeleteResult>`
- `success: boolean` - Deletion succeeded
- `storagePath: string` - Storage path

**Strategy:**
1. Use stored file path (from database)
2. Call deleteStorageFile
3. Check result.success
4. Handle failures appropriately
5. Update database to remove path reference

### For Batch Deletion

**Strategy:** Use deleteStorageFiles for multiple file deletion.

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/deleter`

**When to Use:**
- Deleting all user files
- Cleaning up multiple documents
- Gallery deletion
- Bulk file cleanup

**Function:** `deleteStorageFiles(urlsOrPaths)`

**Parameters:**
- `urlsOrPaths: string[]` - Array of download URLs or storage paths

**Returns:** `Promise<BatchDeleteResult>`
- `successful: string[]` - Array of deleted storage paths
- `failed: Array<{path, error}>` - Failed deletions with errors

**Strategy:**
1. Collect file paths from database
2. Call deleteStorageFiles with paths array
3. Check result.successful and result.failed
4. Log or retry failed deletions
5. Update database to remove deleted paths

### For User Account Deletion

**Strategy:** Delete all user files when account is deleted.

**Import From:** `@umituz/react-native-firebase/storage` and firestore

**When to Use:**
- User deletes account
- GDPR compliance
- User data cleanup
- Admin-initiated deletion

**Implementation Strategy:**
1. Fetch all user file paths from Firestore
2. Call deleteStorageFiles with paths
3. Check for partial failures
4. Log failed deletions for manual cleanup
5. Delete Firestore user document
6. Delete Auth account

### For Old Avatar Replacement

**Strategy:** Delete old avatar when uploading new one.

**Import From:** `@umituz/react-native-firebase/storage` and firestore

**When to Use:**
- User updates profile picture
- Avatar replacement
- Image updates

**Implementation Strategy:**
1. Upload new avatar
2. Get new download URL
3. Delete old avatar if path exists
4. Update user document with new path
5. Handle deletion failure gracefully (old file not critical)

### For Temporary File Cleanup

**Strategy:** Delete temporary files after use.

**Import From:** `@umituz/react-native-firebase/storage` and firestore

**When to Use:**
- Clean up temp files after processing
- Remove upload drafts
- Delete expired files

**Implementation Strategy:**
1. Track temporary files in database
2. Schedule cleanup after time period
3. Use batch deletion
4. Log failures for manual review
5. Update database to remove references

### For File Path Tracking

**Strategy:** Store file paths in Firestore for later deletion.

**Import From:** Firestore repository

**When to Use:**
- Need to delete files later
- User account management
- File ownership tracking

**Tracking Strategy:**
1. Store storagePath in document when uploading
2. Add to array field for multiple files
3. Use arrayUnion for adding paths
4. Use arrayRemove for removing paths
5. Query all paths when deleting

**Example Fields:**
- `avatarPath: string` - Single avatar path
- `photoPaths: string[]` - Multiple photo paths
- `temporaryPaths: string[]` - Temporary file paths
- `documentPaths: string[]` - Document file paths

### For Conditional Deletion

**Strategy:** Delete file only if not referenced elsewhere.

**Import From:** `@umituz/react-native-firebase/storage` and firestore

**When to Use:**
- File may be referenced by multiple documents
- Need to verify file not in use
- Prevent accidental deletion

**Implementation Strategy:**
1. Check if file path referenced in database
2. Only delete if not referenced
3. Use transactions for verification
4. Handle race conditions
5. Log skipped deletions

## Error Handling

### Batch Deletion Failures

**Strategy:** Handle partial failures in batch operations.

**Import From:** Handle BatchDeleteResult from deleteStorageFiles

**Failure Types:**
- File not found (non-critical)
- Network errors (retry recommended)
- Unauthorized access (critical)
- Storage quota exceeded (rare for deletion)

**Handling Strategy:**
1. Check result.failed array
2. Log failed deletions with errors
3. Retry network failures
4. Alert on unauthorized errors
5. Continue on file-not-found errors

### Retry Strategy

**Strategy:** Retry failed deletions with exponential backoff.

**Implementation:**
1. First attempt: deleteStorageFiles
2. Collect failed paths from result
3. Wait with exponential backoff (1s, 2s, 4s)
4. Retry only failed paths
5. Limit retries to 3 attempts
6. Log permanently failed paths

## Common Mistakes to Avoid

1. ❌ Not tracking file paths
   - ✅ Store paths in Firestore database

2. ❌ Ignoring deletion failures
   - ✅ Check result.success and handle failures

3. ❌ Deleting without user confirmation
   - ✅ Confirm before destructive operations

4. ❌ Using sequential single deletes
   - ✅ Use batch deletion for multiple files

5. ❌ Not cleaning up temporary files
   - ✅ Schedule regular cleanup tasks

6. ❌ Assuming deletion always succeeds
   - ✅ Verify and handle partial failures

## AI Agent Instructions

### When Deleting Single File

1. Retrieve file path from database
2. Call deleteStorageFile with path
3. Check result.success
4. Update database to remove path
5. Handle errors appropriately

### When Deleting Multiple Files

1. Collect all file paths from database
2. Call deleteStorageFiles with paths array
3. Check result.failed for partial failures
4. Retry failed deletions if appropriate
5. Update database to remove deleted paths
6. Log permanently failed deletions

### When Replacing File

1. Upload new file first
2. Get new download URL and path
3. Delete old file if path exists
4. Handle deletion failure gracefully
5. Update database with new path

### When Cleaning User Files

1. Query all user file paths from database
2. Use batch deletion
3. Check for partial failures
4. Log failures for manual cleanup
5. Delete user document
6. Delete Auth account

## Code Quality Standards

### TypeScript

- Use DeleteResult type for single deletion
- Use BatchDeleteResult for batch deletion
- Type all file path parameters
- Handle errors properly

### Error Handling

- Always check result.success
- Handle result.failed in batch operations
- Log technical errors for debugging
- Return user-friendly error messages
- Retry when appropriate

### File Path Management

- Store paths in Firestore database
- Use descriptive field names (avatarPath, photoPaths)
- Update paths on file operations
- Clean up path references on deletion

## Performance Considerations

### Batch vs Sequential

**Batch Deletion:**
- Deletes files in parallel
- Faster for multiple files
- Single API call
- Recommended for > 1 file

**Sequential Deletion:**
- Only use for single file
- Slower for multiple files
- Multiple API calls
- Not recommended

### Path Tracking Overhead

- Minimal overhead to store paths
- Faster deletion with known paths
- No need to list Storage files
- Better than URL parsing

## Related Documentation

- [Storage Module README](../README.md)
- [Storage Uploader README](../uploader/README.md)
- [Storage Types README](../types/README.md)
- [Auth README](../../auth/README.md)

## API Reference

### Main Functions

**Import Path:** `@umituz/react-native-firebase/storage` or `src/storage/deleter`

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `deleteStorageFile` | downloadUrlOrPath | `Promise<DeleteResult>` | Delete single file |
| `deleteStorageFiles` | urlsOrPaths[] | `Promise<BatchDeleteResult>` | Delete multiple files |

### Type Definitions

**DeleteResult:**
- `success: boolean` - Deletion succeeded
- `storagePath: string` - Storage path

**BatchDeleteResult:**
- `successful: string[]` - Array of deleted storage paths
- `failed: Array<{path, error}>` - Failed deletions with error messages

---

**Last Updated:** 2025-01-08
**Maintainer:** Storage Module Team
