# Firestore Utilities

Utility functions for Firestore operations including date handling, query building, pagination, document mapping, path resolution, and error detection.

## Purpose

Provides reusable utility functions for common Firestore operations, ensuring consistency and reducing boilerplate code across the application.

## For AI Agents

### Before Using Firestore Utils

1. **IMPORT** from `@umituz/react-native-firebase/firestore` or `src/firestore/utils`
2. **USE** utilities instead of writing custom implementations
3. **FOLLOW** established patterns for consistency
4. **NEVER** duplicate utility functionality
5. **CHECK** if utility exists before creating new functions

### Required Practices

1. **Use date utilities** - For all Firestore timestamp conversions
2. **Use query builder** - For programmatic query construction
3. **Use pagination helper** - For consistent pagination logic
4. **Use document mapper** - For type-safe document transformations
5. **Use path resolver** - For standardized path generation

### Forbidden Practices

## ❌ NEVER

- Write custom timestamp conversion logic
- Build queries with string concatenation
- Implement pagination from scratch
- Manually map Firestore documents
- Hardcode collection paths
- Ignore quota error detection

## ⚠️ Avoid

- Inconsistent date formats
- Query string building
- Duplicate pagination logic
- Manual document casting
- scattered path patterns
- Missing error detection

## Date Utilities

### isoToTimestamp

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Convert ISO string to Firestore Timestamp

**Parameters:**
- `isoString: string` - ISO date string

**Returns:** Firestore Timestamp object

**Usage Strategy:**
1. Use when querying with timestamps
2. Convert stored ISO strings to Timestamps
3. Pass to Firestore where clause
4. Handle invalid ISO strings

**When to Use:**
- Query filters with timestamps
- Before Firestore operations
- Converting stored dates
- Timestamp comparisons

### timestampToISO

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Convert Firestore Timestamp to ISO string

**Parameters:**
- `timestamp: Timestamp` - Firestore Timestamp object

**Returns:** ISO string date

**Usage Strategy:**
1. Convert Firestore timestamps to ISO
2. Store dates as ISO strings in database
3. Use for display or calculations
4. Handle null/undefined timestamps

**When to Use:**
- After fetching documents
- Storing dates in state
- Displaying dates to users
- Date calculations

### timestampToDate

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Convert Firestore Timestamp to JavaScript Date

**Parameters:**
- `timestamp: Timestamp` - Firestore Timestamp object

**Returns:** JavaScript Date object

**Usage Strategy:**
1. Convert to Date for date operations
2. Use for date formatting
3. Use for date calculations
4. Handle invalid timestamps

**When to Use:**
- Date formatting with toLocaleDateString
- Date calculations (add days, etc.)
- Date comparisons
- Display formatting

### getCurrentISOString

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Get current date/time as ISO string

**Parameters:** None

**Returns:** Current ISO string

**Usage Strategy:**
1. Use for createdAt timestamps
2. Use for updatedAt timestamps
3. Call once per document creation
4. Consistent timestamp format

**When to Use:**
- Creating new documents
- Updating documents
- Timestamp generation
- Audit trails

## Query Builder

### buildQuery

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Build Firestore queries with filters and sorting

**Parameters:**
- `collection: CollectionReference` - Base collection
- `options: QueryOptions` - Query configuration

**QueryOptions Properties:**
- `filters?: Filter[]` - Array of query filters
- `orderBy?: { field: string; direction?: 'asc' | 'desc' }`
- `limit?: number` - Max documents to return

**Returns:** Firestore Query object

**Usage Strategy:**
1. Import buildQuery from utils
2. Create filters with createEqualFilter or createInFilter
3. Pass collection and options
4. Execute returned query
5. Handle query results

**When to Use:**
- Dynamic queries based on user input
- Complex filtering requirements
- Ordered result sets
- Limited result sets

### createEqualFilter

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Create equality filter for queries

**Parameters:**
- `field: string` - Field name
- `value: any` - Value to compare

**Returns:** Filter object

**Usage Strategy:**
1. Use for exact match queries
2. Chain multiple filters
3. Use with buildQuery
4. Type-safe field names

**When to Use:**
- Finding specific documents
- User ID lookups
- Category filtering
- Status filtering

### createInFilter

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Create IN filter for multiple values

**Parameters:**
- `field: string` - Field name
- `values: any[]` - Array of values

**Returns:** Filter object

**Usage Strategy:**
1. Use for multiple value matching
2. Limit to 10 values (Firestore limit)
3. Use with buildQuery
4. Consider array-contains for array fields

**When to Use:**
- Multiple category selection
- Multi-status queries
- Batch ID lookups
- Multiple user queries

## Pagination Helper

### createPaginationHelper

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Create helper for cursor-based pagination

**Parameters:**
- `getCursor: (doc) => string` - Extract cursor from document

**Returns:** Pagination helper object with methods

**Methods:**
- `buildResult(items, limit)` - Build PaginatedResult from items
- `getCursor(doc)` - Extract cursor from document

**Usage Strategy:**
1. Create helper for each collection
2. Define cursor extraction function
3. Fetch limit + 1 documents
4. Use buildResult to create PaginatedResult
5. Store nextCursor for subsequent requests

**When to Use:**
- Large datasets requiring pagination
- Infinite scroll implementations
- Performance optimization
- Mobile applications

**Cursor Strategy:**
- Use sortable field for cursor (createdAt, document ID)
- Extract field value as cursor string
- Pass cursor to next page query
- Consistent sorting required

## Document Mapper

### createDocumentMapper

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Create type-safe document mapper for Firestore documents

**Parameters:**
- `transform: (doc) => T` - Transformation function

**Returns:** Mapper function for documents

**Usage Strategy:**
1. Define entity type
2. Create transformation function
3. Add createdAt, updatedAt, id fields
4. Type-safe document mapping
5. Use in repository methods

**When to Use:**
- Repository implementations
- Type safety requirements
- Consistent document structure
- Adding metadata to documents

**Document Enrichment:**
- Add document id to entity
- Add timestamps (createdAt, updatedAt)
- Transform field names if needed
- Validate data structure
- Convert nested objects

## Path Resolver

### FirestorePathResolver

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Generate standardized Firestore collection paths

**Constructor:**
- `collectionName: string` - Collection name

**Methods:**
- `getUserCollection(userId)` - Get user's collection reference
- `getDocRef(userId, docId)` - Get document reference

**Usage Strategy:**
1. Create resolver instance per collection
2. Pass collection name to constructor
3. Use getUserCollection for queries
4. Use getDocRef for document operations
5. Follow users/{userId}/{collectionName} pattern

**When to Use:**
- Repository implementations
- User-specific data
- Standardized paths
- Security rules compatibility

**Path Pattern:**
- Collection: `users/{userId}/{collectionName}`
- Document: `users/{userId}/{collectionName}/{docId}`
- Consistent across application
- Security rules friendly
- Multi-tenant support

## Quota Error Detector

### isQuotaError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Check if error is Firestore quota error

**Parameters:**
- `error: unknown` - Error to check

**Returns:** `boolean` - True if quota error

**Usage Strategy:**
1. Wrap Firestore operations in try-catch
2. Check error with isQuotaError()
3. Show user-friendly message
4. Disable further operations
5. Never retry quota errors

**When to Use:**
- After Firestore operations
- Error handling logic
- User feedback
- Operation throttling

### isRetryableError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Check if error is retryable

**Parameters:**
- `error: unknown` - Error to check

**Returns:** `boolean` - True if retryable

**Usage Strategy:**
1. Check error after failed operation
2. Retry with exponential backoff if true
3. Set max retry limit (typically 3)
4. Don't retry quota errors
5. Log retryable errors

**When to Use:**
- Transient error handling
- Network failures
- Resource exhaustion
- Rate limit handling

### getQuotaErrorMessage

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

**Purpose:** Get user-friendly quota error message

**Parameters:** None

**Returns:** `string` - Error message

**Usage Strategy:**
1. Call when quota error detected
2. Show message to user
3. Suggest upgrade or retry later
4. Localize message if needed
5. Provide actionable guidance

**When to Use:**
- UI error display
- User notifications
- Error logging
- Support messages

## Common Mistakes to Avoid

1. ❌ Writing custom date conversion logic
   - ✅ Use provided date utilities

2. ❌ Building queries with string concatenation
   - ✅ Use query builder utilities

3. ❌ Manual pagination implementation
   - ✅ Use pagination helper

4. ❌ Hardcoding collection paths
   - ✅ Use path resolver

5. ❌ Not detecting quota errors
   - ✅ Use quota error detector

## AI Agent Instructions

### When Using Date Utilities

1. Always use ISO strings for storage
2. Convert to Timestamp for queries
3. Convert to Date for display
4. Use getCurrentISOString for timestamps
5. Handle invalid date formats

### When Building Queries

1. Use buildQuery for complex queries
2. Create filters with filter utilities
3. Specify orderBy for sorted results
4. Set limit for result size
5. Handle empty results gracefully

### When Implementing Pagination

1. Use createPaginationHelper
2. Define cursor extraction function
3. Fetch limit + 1 documents
4. Use buildResult for PaginatedResult
5. Store nextCursor for subsequent requests

### When Mapping Documents

1. Use createDocumentMapper
2. Add metadata (id, timestamps)
3. Transform field names if needed
4. Ensure type safety
5. Validate data structure

## Code Quality Standards

### Utility Usage

- Import from correct path
- Use utilities consistently
- Don't duplicate functionality
- Handle errors appropriately
- Type-safe operations

### Error Handling

- Check for quota errors
- Retry retryable errors
- Show user-friendly messages
- Log errors appropriately
- Handle edge cases

### Performance

- Use pagination for large datasets
- Limit query results
- Use indexes for queried fields
- Avoid client-side filtering
- Batch operations when possible

## Performance Considerations

### Date Operations

- ISO strings for storage (efficient)
- Timestamp for queries (indexed)
- Date for display (formatting)
- Convert once, reuse results
- Cache conversions when appropriate

### Query Building

- Build queries programmatically
- Use compound indexes
- Limit result size
- Filter on server-side
- Avoid unnecessary sorts

### Pagination

- Fetch limit + 1 for hasMore detection
- Use cursor-based pagination
- Store only cursor in state
- Load next page on demand
- Stop when hasMore is false

## Related Documentation

- [Date Utils README](../dateUtils/README.md)
- [Query Builder README](../query-builder/README.md)
- [Pagination Helper README](../pagination.helper/README.md)
- [Document Mapper README](../document-mapper.helper/README.md)
- [Path Resolver README](../path-resolver/README.md)
- [Quota Error Detector README](../quota-error-detector/README.md)

## API Reference

### Date Utilities

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `isoToTimestamp` | `isoString` | `Timestamp` | Convert ISO to Timestamp |
| `timestampToISO` | `timestamp` | `string` | Convert Timestamp to ISO |
| `timestampToDate` | `timestamp` | `Date` | Convert Timestamp to Date |
| `getCurrentISOString` | - | `string` | Get current ISO string |

### Query Builder

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `buildQuery` | `collection, options` | `Query` | Build Firestore query |
| `createEqualFilter` | `field, value` | `Filter` | Create equality filter |
| `createInFilter` | `field, values[]` | `Filter` | Create IN filter |

### Pagination Helper

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `createPaginationHelper` | `getCursor(doc)` | `PaginationHelper` | Create pagination helper |

**PaginationHelper Methods:**
- `buildResult(items, limit)` - Build PaginatedResult
- `getCursor(doc)` - Extract cursor from document

### Document Mapper

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `createDocumentMapper` | `transform(doc)` | `Mapper` | Create document mapper |

### Path Resolver

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

| Class | Methods | Description |
|------|---------|-------------|
| `FirestorePathResolver` | `getUserCollection(userId)` | Get user collection reference |
| `FirestorePathResolver` | `getDocRef(userId, docId)` | Get document reference |

### Quota Error Detector

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/utils`

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `isQuotaError` | `error` | `boolean` | Check if quota error |
| `isRetryableError` | `error` | `boolean` | Check if retryable |
| `getQuotaErrorMessage` | - | `string` | Get error message |

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
