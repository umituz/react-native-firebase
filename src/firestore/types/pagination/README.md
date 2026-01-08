# Pagination Types

TypeScript types and interfaces for Firestore pagination operations.

## Purpose

Provides type-safe pagination structures for cursor-based pagination in Firestore queries, ensuring consistent pagination patterns across the application.

## For AI Agents

### Before Using Pagination Types

1. **UNDERSTAND** cursor-based pagination (not offset-based)
2. **USE** these types for all paginated queries
3. **NEVER** mix with offset-based pagination
4. **ALWAYS** fetch limit + 1 for hasMore detection
5. **STORE** cursor for next page in UI state

### Required Practices

1. **Use PaginatedResult<T>** for all paginated query returns
2. **Use PaginationParams** for all paginated query inputs
3. **Fetch limit + 1** to detect if more pages exist
4. **Store nextCursor** in UI state for subsequent requests
5. **Handle empty results** with EMPTY_PAGINATED_RESULT

### Forbidden Practices

## ❌ NEVER

- Use offset-based pagination (skip/take) - not scalable
- Fetch exactly limit items (can't detect hasMore)
- Mix cursor and offset pagination
- Ignore nextCursor (breaks pagination)
- Use pagination for small datasets (< 100 items)

## ⚠️ Avoid

- Complex cursor extraction logic
- Storing entire paginated result in state (only cursor needed)
- Not handling last page correctly
- Infinite loops in pagination
- Inconsistent page sizes

## Usage Strategies

### For Repository Methods

**Strategy:** Return PaginatedResult from repository query methods.

**Import From:** `src/firestore/types/pagination`

**When to Use:**
- Large datasets (> 100 documents)
- Infinite scroll implementations
- Ordered result sets requiring pagination
- Mobile applications (performance)

**Repository Pattern:**
1. Accept `PaginationParams` as parameter
2. Fetch `limit + 1` documents
3. Build PaginatedResult from fetched items
4. Set `hasMore: true` if items.length > limit
5. Set `nextCursor` from last visible item

**Type Safety:**
- Use generic type `PaginatedResult<EntityType>`
- TypeScript ensures type consistency
- Autocomplete for result properties

### For UI Components

**Strategy:** Store cursor in state, load next page on demand.

**Import From:** `src/firestore/types/pagination`

**State Management:**
- Store `data: T[]` in state
- Store `hasMore: boolean` in state
- Store `nextCursor?: string` in state
- Load more when user reaches end

**Pagination Flow:**
1. Initial load: Call with `{ pageSize: 20 }`
2. Append results to state
3. Store nextCursor if hasMore is true
4. On scroll end: Call with `{ pageSize: 20, cursor }`
5. Stop when hasMore is false

### For React Hooks

**Strategy:** Create custom hook for pagination state management.

**Import From:** `src/firestore/types/pagination`

**Hook Responsibilities:**
- Manage pagination state
- Provide loadMore function
- Handle loading states
- Reset pagination when needed

**Hook State:**
- `data` - Accumulated items across pages
- `hasMore` - Whether more pages exist
- `loading` - Current page loading state
- `error` - Any error from last fetch

**Hook Methods:**
- `loadMore()` - Fetch next page
- `refresh()` - Reset and reload
- `hasNextPage()` - Check if can load more

## Type Definitions

### PaginationParams

**Import From:** `src/firestore/types/pagination`

**Properties:**
- `pageSize?: number` - Items per page (default: 20)
- `cursor?: string` - Cursor from previous page's last item

**Usage:**
- Pass to repository `paginate()` method
- Include cursor for page 2+
- Omit cursor for first page

### PaginatedResult<T>

**Import From:** `src/firestore/types/pagination`

**Generic Type:** `<T>` - Type of items in data array

**Properties:**
- `data: T[]` - Items for current page
- `hasMore: boolean` - Whether more pages exist
- `nextCursor?: string` - Cursor for next page (null if no more)
- `totalCount?: number` - Total count (optional, rarely used)

**Usage:**
- Return type for repository paginate methods
- Type-safe with generic parameter
- TypeScript knows item types

### EMPTY_PAGINATED_RESULT

**Import From:** `src/firestore/types/pagination`

**Type:** `PaginatedResult<never>`

**Value:**
- `data: []` - Empty array
- `hasMore: false` - No more pages

**Usage:**
- Default initial state
- Error fallback
- Empty dataset indication

## Cursor-Based Pagination Strategy

### Why Cursor-Based?

**Benefits:**
- Scalable (doesn't skip documents)
- Consistent results (no duplicates)
- Real-time friendly (new items appear naturally)
- Better performance (no offset scanning)

**Why Not Offset-Based:**
- Offset scans all skipped documents
- Slows down with page number
- Can show duplicates if items added
- Can miss items if items deleted

### Cursor Extraction

**Strategy:** Use sortable field value as cursor.

**Common Cursor Fields:**
- `createdAt` timestamp
- Document ID (`__name__`)
- Any unique, sortable field

**Requirements:**
- Field must be indexed in Firestore
- Field must be sortable
- Consistent across queries
- Unique per document (preferably)

### Page Size Strategy

**Recommended Sizes:**
- Mobile: 10-20 items per page
- Desktop: 20-50 items per page
- Infinite scroll: 20 items per page

**Considerations:**
- Larger pages = fewer requests but more data transfer
- Smaller pages = faster initial load but more requests
- Consider document size (images, large text)
- Test with real user data

## Common Mistakes to Avoid

1. ❌ Using offset-based pagination
   - ✅ Use cursor-based pagination

2. ❌ Fetching exactly limit items
   - ✅ Fetch limit + 1 to detect hasMore

3. ❌ Not sorting consistently
   - ✅ Always sort same field same direction

4. ❌ Complex cursor logic
   - ✅ Use simple field value as cursor

5. ❌ Storing entire result in state
   - ✅ Store only cursor, fetch data on demand

6. ❌ Not handling last page
   - ✅ Check hasMore before loading more

## AI Agent Instructions

### When Creating Paginated Repository

1. Extend `BasePaginatedRepository<TEntity, TOptions>`
2. Implement `buildQuery(options, cursor?)` method
3. Use `PaginationHelper` for result building
4. Return `PaginatedResult<TEntity>` type
5. Document cursor field used

### When Creating Paginated Hook

1. Import types from `src/firestore/types/pagination`
2. Manage state for data, hasMore, nextCursor
3. Provide loadMore function
4. Handle loading and error states
5. Reset pagination when needed

### When Adding Pagination to UI

1. Use pagination hook or state
2. Call loadMore on scroll end
3. Show loading indicator
4. Stop when hasMore is false
5. Handle errors gracefully

## Code Quality Standards

### TypeScript

- Always specify generic type `<T>`
- Never use `any` type
- Import types from correct path
- Use strict type checking

### File Organization

- One paginated repository per entity
- Types in separate types file
- Hooks in presentation layer
- Tests for pagination logic

## Performance Considerations

### Fetch Strategy

**Always Fetch limit + 1:**
- Fetch 21 items for pageSize of 20
- If returned 21, hasMore = true
- Return only 20 items
- Use 21st item's cursor for next page

**Why +1?**
- Determines if more pages exist
- Provides cursor for next page
- Minimal performance impact
- Standard pagination pattern

### State Management

**Store Minimal State:**
- Cursor string only (not entire result)
- hasMore boolean
- Current data array
- Don't store all pages in state

**Why Minimal State?**
- Reduces memory usage
- Faster renders
- Simpler logic
- Better UX (can refresh)

## Related Documentation

- [Pagination Helper README](../../utils/pagination.helper/README.md)
- [Base Paginated Repository README](../../infrastructure/repositories/base-paginated-repository/README.md)
- [Firestore Module README](../README.md)

## API Reference

### Main Types

**Import Path:** `src/firestore/types/pagination`

| Type | Description | Generic |
|------|-------------|---------|
| `PaginationParams` | Input parameters for pagination | No |
| `PaginatedResult<T>` | Result from paginated query | Yes |
| `EMPTY_PAGINATED_RESULT` | Empty result constant | No |

### Type Usage

**For Repository Methods:**
- Return type: `async paginate(params: PaginationParams): Promise<PaginatedResult<User>>`
- Input type: `params: { pageSize: 20, cursor: 'abc123' }`
- Specify generic type for type safety
- TypeScript enforces type consistency

**For UI State:**
- State for data: `useState<User[]>([])`
- State for hasMore: `useState<boolean>(false)`
- State for cursor: `useState<string>()`
- Store cursor for next page requests
- Check hasMore before loading more

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
