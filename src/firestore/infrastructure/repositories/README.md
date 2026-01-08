# Firestore Repositories

Repository pattern implementation for Firestore database operations providing base classes for CRUD, queries, and pagination.

## Purpose

Provides a hierarchical repository system for Firestore operations with three levels: BaseRepository (basic CRUD), BaseQueryRepository (advanced querying), and BasePaginatedRepository (pagination support).

## For AI Agents

### Before Using Repositories

1. **ALWAYS** extend appropriate base repository class
2. **IMPLEMENT** buildQuery() method for query repositories
3. **USE** types for entities and options
4. **NEVER** call Firebase Firestore directly in application code
5. **REGISTER** middleware in repository constructor

### Required Practices

1. **Extend base repository** - Always extend BaseRepository, BaseQueryRepository, or BasePaginatedRepository
2. **Implement buildQuery()** - For query/paginated repositories, must implement this abstract method
3. **Use types** - Define entity type and options type as generics
4. **Register middleware** - Add middleware in constructor for cross-cutting concerns
5. **Return PaginatedResult** - For paginated repositories, use PaginatedResult<T> type

### Forbidden Practices

## ❌ NEVER

- Use Firebase Firestore SDK directly in application code
- Skip implementing buildQuery() in query repositories
- Use `any` type for entity or options
- Create repositories without extending base classes
- Mix pagination strategies (cursor vs offset)
- Query without proper indexes

## ⚠️ Avoid

- Complex query logic in buildQuery() method
- Not using middleware for cross-cutting concerns
- Fetching entire collections without pagination
- Not handling empty query results
- Ignoring composite index requirements

## Usage Strategies

### For Basic CRUD Operations

**Strategy:** Extend BaseRepository for simple collection operations.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/repositories`

**When to Use:**
- Simple collections without complex queries
- Basic CRUD operations only
- Small datasets (< 100 documents)
- No pagination needed

**Available Methods:**
- `findById(id)` - Get document by ID
- `create(data)` - Create new document
- `update(id, data)` - Update document
- `delete(id)` - Delete document
- `getAll()` - Get all documents
- `exists(id)` - Check if document exists
- `getCollection()` - Get Firestore collection reference

**Implementation:**
1. Extend BaseRepository<TEntity>
2. Pass collection name to super()
3. Add custom methods if needed
4. Use in services or hooks

### For Advanced Queries

**Strategy:** Extend BaseQueryRepository for filtering, sorting, and querying.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/repositories`

**When to Use:**
- Need where clauses and filtering
- Require sorting and ordering
- Need limit queries
- Complex query conditions

**Available Methods:**
- All BaseRepository methods
- `find(options)` - Find documents matching options
- `findFirst(options)` - Get first matching document
- `count(options)` - Count matching documents
- `buildQuery(options)` - Build Firestore query (abstract)

**Implementation Strategy:**
1. Extend BaseQueryRepository<TEntity, TOptions>
2. Define TOptions interface for query parameters
3. Implement buildQuery() method
4. Use QueryBuilder helper if needed
5. Add custom query methods

**buildQuery() Implementation Order (REQUIRED):**
1. Get base collection: `this.getCollection()`
2. Apply where clauses (all filters first)
3. Apply orderBy (sorting)
4. Apply limit (last step)
5. Return query

### For Pagination

**Strategy:** Extend BasePaginatedRepository for cursor-based pagination.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/repositories`

**When to Use:**
- Large datasets (> 100 documents)
- Infinite scroll implementations
- Mobile applications
- Performance optimization

**Available Methods:**
- All BaseQueryRepository methods
- `paginate(params)` - Fetch page with cursor
- `buildQuery(options, cursor?)` - Build query with cursor

**Pagination Strategy:**
1. Fetch `pageSize + 1` documents
2. If returned > pageSize, hasMore = true
3. Return only pageSize documents
4. Use last document as cursor for next page
5. Stop when hasMore is false

**Implementation:**
1. Extend BasePaginatedRepository<TEntity, TOptions>
2. Implement buildQuery() with cursor parameter
3. Use `startAfter(cursor)` when cursor provided
4. Return PaginatedResult<TEntity> from paginate()
5. Store nextCursor in UI state

### For Middleware Integration

**Strategy:** Register middleware in repository constructor for cross-cutting concerns.

**Import From:** `@umituz/react-native-firebase/firestore` infrastructure/middleware

**Available Middleware:**
- `quotaTrackingMiddleware` - Track Firestore quota usage
- `queryDeduplicationMiddleware` - Deduplicate identical queries
- `errorHandlingMiddleware` - Centralized error handling
- `loggingMiddleware` - Log all repository operations

**Registration Strategy:**
1. Import middleware functions
2. Call `this.registerMiddleware()` in constructor
3. Middleware executes in registration order
4. Use for quota tracking, caching, etc.

## Repository Hierarchy

### BaseRepository

**Purpose:** Basic CRUD operations for single collections

**Import From:** `src/firestore/infrastructure/repositories/base-repository`

**Provides:**
- findById, create, update, delete
- getAll, exists
- getCollection (raw access)

**Generic Types:**
- `TEntity` - Document entity type

**Usage:** Simple collections without queries

### BaseQueryRepository

**Purpose:** Advanced querying with filtering and sorting

**Import From:** `src/firestore/infrastructure/repositories/base-query-repository`

**Extends:** BaseRepository

**Adds:**
- find(options) - Multiple documents
- findFirst(options) - Single document
- count(options) - Count matches
- buildQuery(options) - Abstract method

**Generic Types:**
- `TEntity` - Document entity type
- `TOptions` - Query options type

**Requires:** Implementation of buildQuery()

### BasePaginatedRepository

**Purpose:** Cursor-based pagination for large datasets

**Import From:** `src/firestore/infrastructure/repositories/base-paginated-repository`

**Extends:** BaseQueryRepository

**Adds:**
- paginate(params) - Fetch page
- buildQuery(options, cursor?) - With cursor support

**Generic Types:**
- `TEntity` - Document entity type
- `TOptions` - Query options type

**Requires:** Implementation of buildQuery() with cursor

## Query Building Strategy

### buildQuery() Method

**Purpose:** Construct Firestore query from options

**Import From:** Extend from base repository

**Required Order:**
1. Get collection reference
2. Apply all where clauses
3. Apply orderBy (single field)
4. Apply limit
5. Return query

**Firestore Limitations:**
- Only one orderBy per query
- Range filters (>, >=, <, <=) require first field to be orderBy
- Composite indexes needed for queries with multiple filters + orderBy
- No native full-text search

**Query Building:**
- Use QueryBuilder helper for complex queries
- Import from: `src/firestore/utils/query-builder`
- Ensures correct order
- Validates query constraints

## Middleware System

### Middleware Pattern

**Strategy:** Register middleware functions in repository constructor.

**Import From:** `src/firestore/infrastructure/middleware`

**Middleware Function Signature:**
- Receives context (collection, operation, options)
- Returns modified context or throws error
- Executes in registration order

**Common Middleware Use Cases:**
- Quota tracking (count reads/writes)
- Query deduplication (cache identical queries)
- Error handling (transform errors)
- Logging (track operations)

**Registration:**
1. Import middleware from infrastructure/middleware
2. Call `this.registerMiddleware(middlewareFunc)` in constructor
3. Middleware auto-executes on all operations

## Common Mistakes to Avoid

1. ❌ Not implementing buildQuery() in query repositories
   - ✅ Always implement abstract buildQuery() method

2. ❌ Using offset-based pagination
   - ✅ Use cursor-based pagination (startAfter)

3. ❌ Querying without indexes
   - ✅ Create composite indexes in Firebase Console

4. ❌ Fetching entire collections
   - ✅ Use pagination for large datasets

5. ❌ Ignoring middleware
   - ✅ Register middleware for cross-cutting concerns

6. ❌ Complex query logic in components
   - ✅ Add custom query methods to repository

7. ❌ Wrong query building order
   - ✅ where → orderBy → limit (strict order)

## AI Agent Instructions

### When Creating New Repository

1. Choose appropriate base class (Base, Query, or Paginated)
2. Define TEntity interface (document structure)
3. Define TOptions interface (if query/paginated)
4. Extend base repository with generics
5. Implement buildQuery() if needed
6. Add custom methods for common queries
7. Register middleware in constructor
8. Export repository instance

### When Adding Query Method

1. Determine if should use find() or custom method
2. For simple queries: Use find() with options
3. For complex queries: Add custom method to repository
4. Use buildQuery() in custom methods
5. Return appropriate type (T, T[], PaginatedResult<T>)
6. Document query purpose and parameters

### When Implementing buildQuery()

1. Start with `this.getCollection()`
2. Apply where clauses for all filters
3. Apply orderBy for sorting
4. Apply limit for result size
5. Apply startAfter(cursor) if paginating
6. Return final Query object
7. Follow strict order (where → orderBy → limit)

### When Adding Middleware

1. Import middleware from infrastructure/middleware
2. Register in constructor using `this.registerMiddleware()`
3. Consider execution order (register in desired order)
4. Test middleware execution
5. Handle middleware errors appropriately

## Code Quality Standards

### TypeScript

- Always specify generic types <TEntity> and <TOptions>
- Export TEntity and TOptions interfaces
- Use strict null checks
- Never use `any` type

### File Organization

- One repository per entity
- Repository in infrastructure/repositories
- Entity types in domain/entities
- Custom options types near repository

### Method Naming

- Use `findBy` prefix for query methods
- Use `get` prefix for single fetch
- Use `count` prefix for counting
- Use `is` prefix for boolean checks

## Performance Considerations

### Query Optimization

**Use Indexes:**
- Create composite indexes for complex queries
- Firestore auto-suggests missing indexes
- Index required for: where + orderBy queries

**Limit Results:**
- Always use limit() on queries
- Pagination for large collections
- Avoid getAll() on large datasets

**Pagination vs Offset:**
- Use cursor-based (startAfter)
- Never use offset-based pagination
- More scalable and performant

### Middleware Overhead

- Minimal performance impact
- Middleware executes synchronously
- Keep middleware functions lightweight
- Avoid async operations in middleware

## Related Documentation

- [Firestore Module README](../../README.md)
- [Pagination Helper README](../../utils/pagination.helper/README.md)
- [Query Builder README](../../utils/query-builder/README.md)
- [Middleware README](../middleware/README.md)
- [Type Definitions README](../../types/pagination/README.md)

## API Reference

### BaseRepository

**Import From:** `src/firestore/infrastructure/repositories/base-repository`

| Method | Return Type | Description |
|--------|-------------|-------------|
| `constructor(collectionName)` | - | Initialize with collection name |
| `findById(id)` | `Promise<T \| null>` | Get document by ID |
| `create(data)` | `Promise<T>` | Create document |
| `update(id, data)` | `Promise<void>` | Update document |
| `delete(id)` | `Promise<void>` | Delete document |
| `getAll()` | `Promise<T[]>` | Get all documents |
| `exists(id)` | `Promise<boolean>` | Check if document exists |
| `getCollection()` | `CollectionReference` | Get raw collection reference |

### BaseQueryRepository

**Import From:** `src/firestore/infrastructure/repositories/base-query-repository`

| Method | Return Type | Description |
|--------|-------------|-------------|
| `find(options)` | `Promise<T[]>` | Find matching documents |
| `findFirst(options)` | `Promise<T \| null>` | Get first match |
| `count(options)` | `Promise<number>` | Count matches |
| `buildQuery(options)` | `Query` | Build query (abstract) |
| `registerMiddleware(middleware)` | `void` | Register middleware |

### BasePaginatedRepository

**Import From:** `src/firestore/infrastructure/repositories/base-paginated-repository`

| Method | Return Type | Description |
|--------|-------------|-------------|
| `paginate(params)` | `Promise<PaginatedResult<T>>` | Fetch page |
| `buildQuery(options, cursor?)` | `Query` | Build query with cursor (abstract) |

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
