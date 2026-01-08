# Pagination Helper

Cursor-based pagination utilities for Firestore queries with type-safe result handling.

## Purpose

Provides consistent pagination logic across all Firestore queries using cursor-based pagination (not offset-based). Handles hasMore detection and cursor extraction for any document type.

## For AI Agents

### Before Using Pagination Helper

1. **UNDERSTAND** cursor-based vs offset-based pagination
2. **ALWAYS** fetch limit + 1 documents for hasMore detection
3. **USE** generic type parameter for type safety
4. **EXTRACT** cursor from appropriate field

### Required Practices

1. **Fetch limit + 1** documents to detect if more pages exist
2. **Use cursor from last visible document** for next page
3. **Sort consistently** for stable pagination
4. **Handle edge cases** (empty results, last page)
5. **Use generic type parameter** for type safety

### Forbidden Practices

## ❌ NEVER

- Use offset-based pagination (skip/take) - not scalable
- Fetch exactly limit documents (can't detect hasMore)
- Use document ID as cursor unless sorted by ID
- Assume pagination state in frontend (always from backend)
- Paginate without sorting

## ⚠️ Avoid

- Large page sizes (use 10-50)
- Inconsistent sort orders between pages
- Complex cursor extraction logic
- Not handling last page correctly

## Usage Strategies

### For Cursor-Based Pagination

**Strategy:** Use last document's field as cursor for next page.

**When to Use:**
- Infinite scroll implementations
- Large dataset navigation
- Ordered result sets
- Real-time data streams

**Why Cursor-Based:**
- Scalable (doesn't skip documents)
- Consistent results (no missing/duplicate items)
- Performance (doesn't scan skipped documents)
- Real-time friendly (new items appear naturally)

**Approach:**
1. Fetch limit + 1 documents
2. If returned > limit, hasMore = true
3. Use last item's cursor for next page
4. Store cursor in frontend state

### For Different Cursor Types

**By Timestamp:**
- Use creation time field
- Requires sorting by timestamp
- Most common for chronological feeds

**By ID:**
- Use document ID
- Requires sorting by __name__
- Good for lexicographic ordering

**By Custom Field:**
- Use any sortable field
- Requires consistent sorting
- Must be unique and stable

### For Type Safety

**Strategy:** Use generic type parameter <T>.

**When to Use:**
- Strongly typed document entities
- Type-safe cursor extraction
- Compile-time type checking

**Approach:**
1. Define document type
2. Create helper with type parameter
3. Type-safe access to fields
4. Type-safe cursor extraction

## API Reference

### PaginationHelper<T>

Generic helper class for pagination logic.

Constructor: No parameters required

Methods:

#### `buildResult(items: T[], pageLimit: number, getCursor: (item: T) => string)`

Build paginated result from fetched items.

**Parameters:**
- **items**: All fetched items (should be limit + 1)
- **pageLimit**: Requested page size
- **getCursor**: Function to extract cursor from item

**Returns:** PaginatedResult<T>

**Behavior:**
- If items.length > limit: hasMore = true, trims to limit
- If items.length <= limit: hasMore = false, returns all items
- Extracts cursor from last item for next page

#### `getLimit(params?: PaginationParams, defaultLimit?: number)`

Extract limit from pagination params or use default.

**Parameters:**
- **params**: Optional pagination parameters
- **defaultLimit**: Default limit (default: 10)

**Returns:** number - Page limit to use

#### `getFetchLimit(pageLimit: number)`

Calculate fetch limit (page limit + 1 for hasMore detection).

**Parameters:**
- **pageLimit**: Requested page size

**Returns:** number - Fetch limit (pageLimit + 1)

**Why:** Fetch one extra to detect if more pages exist.

#### `hasCursor(params?: PaginationParams)`

Check if pagination params has a cursor.

**Parameters:**
- **params**: Optional pagination parameters

**Returns:** boolean - True if cursor exists

**Use For:** Determining if this is a first page or subsequent page

### Helper Functions

#### `createPaginationHelper<T>()`

Factory function to create typed pagination helper.

**Returns:** PaginationHelper<T>

**Use For:** Cleaner API, type inference

## Result Types

### PaginatedResult<T>

- **items**: T[] - Paginated items (trimmed to limit)
- **nextCursor**: string | null - Cursor for next page (null if no more)
- **hasMore**: boolean - Whether more pages exist

### PaginationParams

- **cursor**: string | null - Current page cursor
- **limit**: number | null - Page size limit

## Common Mistakes to Avoid

1. ❌ Fetching exactly limit documents
   - ✅ Fetch limit + 1 to detect hasMore

2. ❌ Using offset-based pagination
   - ✅ Use cursor-based pagination

3. ❌ Not sorting consistently
   - ✅ Always sort same field in same direction

4. ❌ Complex cursor logic
   - ✅ Use simple field-based cursor extraction

5. ❌ Not handling last page
   - ✅ Return hasMore: false when items <= limit

## AI Agent Instructions

### When Implementing Pagination

1. Always fetch limit + 1 documents
2. Use buildResult to handle hasMore logic
3. Extract cursor from sorted field
4. Store nextCursor for subsequent requests
5. Handle null cursor (first page)

### When Creating Paginated Repository

1. Extend BasePaginatedRepository
2. Use PaginationHelper in implementation
3. Accept PaginationParams in query methods
4. Return PaginatedResult type
5. Document cursor field used

### For Custom Cursor Logic

1. Keep getCursor function simple
2. Extract from sorted field
3. Return string representation
4. Handle null/undefined gracefully
5. Document cursor extraction logic

## Integration with Repositories

**Strategy:** Use PaginationHelper in BasePaginatedRepository.

**Repository Implementation:**
1. Extract limit from params using getLimit()
2. Calculate fetch limit using getFetchLimit()
3. Build query with cursor if hasCursor() is true
4. Fetch fetchLimit documents
5. Build result using buildResult()

## Performance Considerations

### Page Size Guidelines

- **Small pages (10-20)**: Better for mobile, less data transfer
- **Medium pages (20-50)**: Good balance
- **Large pages (50-100)**: Fewer requests, more data

**Recommendation:** Start with 20, adjust based on:

- Document size
- Network conditions
- UI requirements
- User behavior

### Query Performance

- Cursor-based queries are efficient
- No document scanning for offsets
- Index usage for sorting
- Consistent performance regardless of page number

## Code Quality Standards

### TypeScript

- Always use generic type parameter <T>
- Define proper return types
- Export pagination types
- Use strict type checking

### Error Handling

- Handle empty item arrays
- Handle null cursor
- Validate page limit > 0
- Handle invalid cursor values

## Related Documentation

- [Pagination Types README](../../types/pagination/README.md)
- [Base Paginated Repository README](../../infrastructure/repositories/base-paginated-repository/README.md)
- [Query Builder README](../query-builder/README.md)

## Migration Guide

### From Offset-Based Pagination

**Don't Do (Offset-Based - Not Scalable):**
- Parameter: `skip: (page - 1) * limit`
- Parameter: `limit: limit`
- Problem: Scans all skipped documents
- Problem: Doesn't scale (slows with page number)

**Do Instead (Cursor-Based - Scalable):**
- Parameter: `cursor: lastDocumentCursor`
- Parameter: `limit: limit`
- Benefit: Starts from specific position
- Benefit: Performs consistently
- Benefit: Scales to large datasets

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
