# Storage Types

TypeScript types and interfaces for Firebase Storage operations.

## Purpose

Provides TypeScript type definitions for Storage operations including upload results, upload options, delete results, and batch deletion results.

## For AI Agents

### Before Using Storage Types

1. **IMPORT** types from storage module for type safety
2. **USE** types for all Storage operation return values
3. **DEFINE** function parameters and return types
4. **NEVER** use `any` type for Storage operations
5. **CHECK** types with type guards when needed

### Required Practices

1. **Import types** from `@umituz/react-native-firebase/storage` or `src/storage/types`
2. **Type all functions** that interact with Storage
3. **Use type guards** for runtime type checking
4. **Define custom types** based on base types when needed
5. **Handle type unions** properly with discriminated unions

### Forbidden Practices

## ❌ NEVER

- Use `any` type for Storage operations
- Ignore TypeScript type errors
- Skip typing function parameters
- Assume types without checking
- Mix incompatible types

## ⚠️ Avoid

- Overly complex type transformations
- Unnecessary type assertions
- Not using provided types
- Creating duplicate type definitions

## Type Definitions

### UploadResult

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/types`

**Purpose:** Result type for successful file uploads

**Properties:**
- `downloadUrl: string` - Public download URL
- `storagePath: string` - Internal storage path

**Usage:**
- Return type for uploadBase64Image()
- Return type for uploadFile()
- Type-safe access to upload results

**When to Use:**
- Typing upload function returns
- Processing upload results
- Storing upload metadata

### UploadOptions

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/types`

**Purpose:** Options for file uploads

**Properties:**
- `mimeType?: string` - Content type (auto-detected for base64)
- `customMetadata?: Record<string, string>` - Custom metadata

**Usage:**
- Pass to uploadBase64Image() as third parameter
- Pass to uploadFile() as third parameter
- Add tracking metadata to uploads

**When to Use:**
- Specifying MIME type explicitly
- Adding custom metadata to uploads
- Tracking upload information

**Common Metadata Fields:**
- `uploadedBy` - User ID
- `originalFileName` - Original file name
- `type` - File type/category
- `uploadedAt` - ISO timestamp
- `width` / `height` - Image dimensions

### DeleteResult

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/types`

**Purpose:** Result type for file deletion operations

**Properties:**
- `success: boolean` - Deletion succeeded
- `storagePath: string` - Storage path

**Usage:**
- Return type for deleteStorageFile()
- Check success status
- Access deleted file path

**When to Use:**
- Typing delete function returns
- Verifying deletion success
- Error handling

### BatchDeleteResult

**Import From:** `@umituz/react-native-firebase/storage` or `src/storage/types`

**Purpose:** Result type for batch file deletion operations

**Properties:**
- `successful: string[]` - Array of deleted storage paths
- `failed: Array<{path, error}>` - Array of failed deletions

**Usage:**
- Return type for deleteStorageFiles()
- Check partial failures
- Handle batch operations

**When to Use:**
- Typing batch delete returns
- Processing batch results
- Handling partial failures

## Type Guards

### isUploadResult

**Import From:** Create in your codebase or import from utils

**Purpose:** Check if value is UploadResult

**Returns:** `boolean`

**Usage Strategy:**
1. Check if value is object
2. Check for downloadUrl property
3. Check for storagePath property
4. Verify types are strings
5. Return boolean

### isSuccessfulDelete

**Import From:** Create in your codebase or import from utils

**Purpose:** Check if DeleteResult is successful

**Returns:** `boolean`

**Usage Strategy:**
1. Check result.success property
2. Return boolean
3. Use for conditional logic

### hasFailures

**Import From:** Create in your codebase or import from utils

**Purpose:** Check if BatchDeleteResult has failures

**Returns:** `boolean`

**Usage Strategy:**
1. Check result.failed.length > 0
2. Return boolean
3. Use for error handling

## Type Utilities

### Utility Types

**Import From:** Use with base types from storage

**Purpose:** Create derived types from base types

**Common Utilities:**
- `UploadResults` - Array of UploadResult
- `DeleteResults` - Array of DeleteResult
- `UploadResultMap` - Record<string, UploadResult>
- `DeleteResultMap` - Record<string, DeleteResult>
- `UploadPromise` - Promise<UploadResult>
- `DeletePromise` - Promise<DeleteResult>
- `BatchDeletePromise` - Promise<BatchDeleteResult>

**Usage:**
- Type arrays of results
- Type promises of results
- Type mapped result objects
- Create generic type-safe functions

### Extract Types

**Import From:** Use TypeScript utility types

**Purpose:** Extract specific property types

**Examples:**
- `type DownloadURL = UploadResult['downloadUrl']`
- `type StoragePath = UploadResult['storagePath']`

**Usage:**
- Type specific properties
- Create utility functions
- Enforce type consistency

## Common Mistakes to Avoid

1. ❌ Not typing upload results
   - ✅ Always use UploadResult type

2. ❌ Not checking delete success
   - ✅ Check result.success property

3. ❌ Ignoring batch delete failures
   - ✅ Check result.failed array

4. ❌ Using any type
   - ✅ Use specific types

5. ❌ Not using provided types
   - ✅ Import types from storage module

## AI Agent Instructions

### When Typing Upload Functions

1. Import UploadResult and UploadOptions
2. Type return value as Promise<UploadResult>
3. Type options parameter as UploadOptions
4. Use type guards for validation
5. Handle errors appropriately

### When Typing Delete Functions

1. Import DeleteResult or BatchDeleteResult
2. Type return value appropriately
3. Check result.success for single delete
4. Check result.failed for batch delete
5. Handle partial failures

### When Creating Custom Types

1. Import base types from storage
2. Extend or use utility types
3. Add specific properties
4. Maintain type compatibility
5. Export custom types

## Code Quality Standards

### TypeScript

- Always use provided types
- Never use `any` type
- Use type guards for runtime checks
- Prefer explicit types over inferred
- Export custom types

### Type Safety

- Enable strict mode
- Use noImplicitAny
- Enable strictNullChecks
- Use proper discriminated unions
- Avoid type assertions

## Performance Considerations

### Type Checking Overhead

- Zero runtime overhead
- Compile-time type checking only
- No performance impact
- Use type guards sparingly

### Type Inference

- Let TypeScript infer when possible
- Use explicit types for public APIs
- Type guards for runtime validation
- Keep type definitions simple

## Related Documentation

- [Storage Module README](../README.md)
- [Storage Uploader README](../uploader/README.md)
- [Storage Deleter README](../deleter/README.md)

## API Reference

### Main Types

**Import Path:** `@umituz/react-native-firebase/storage` or `src/storage/types`

| Type | Purpose | Properties |
|------|---------|------------|
| `UploadResult` | Upload operation result | downloadUrl, storagePath |
| `UploadOptions` | Upload configuration | mimeType?, customMetadata? |
| `DeleteResult` | Delete operation result | success, storagePath |
| `BatchDeleteResult` | Batch delete result | successful[], failed[] |

---

**Last Updated:** 2025-01-08
**Maintainer:** Storage Module Team
