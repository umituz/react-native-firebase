# Firestore Module

Comprehensive Firestore database module providing repository pattern, query builders, pagination, quota management, and middleware support for React Native applications.

## Purpose

Provides a clean, maintainable abstraction over Firestore with repository pattern, quota tracking, query optimization, and comprehensive error handling.

## For AI Agents

### Before Using This Module

1. **READ** this entire README
2. **UNDERSTAND** the repository pattern (not direct Firestore access)
3. **FOLLOW** existing patterns - don't reinvent
4. **CHECK** file size limits (max 200 lines per file)
5. **RESPECT** architectural boundaries

### Layer Rules

**Domain Layer (`domain/`)**
- Contains business logic, entities, errors, constants
- No external dependencies (Firestore-free)
- Defines interfaces and types

**Infrastructure Layer (`infrastructure/`)**
- Contains repositories, middleware, services
- Depends on Firestore SDK
- Implements interfaces defined in domain

**Utils Layer (`utils/`)**
- Contains helper functions and utilities
- No business logic
- Reusable across modules

## ✅ Required Practices

### Repository Pattern Usage

1. **Always extend** repository base classes
2. **Never access** Firestore SDK directly in UI
3. **Use repositories** for all data operations
4. **Implement buildQuery()** in query repositories
5. **Handle errors** appropriately

### Query Building

1. **Use query builder** for complex queries
2. **Respect Firestore limitations** (compound queries, IN operator limits)
3. **Use pagination** for large datasets
4. **Create indexes** in Firebase Console when needed
5. **Filter on server** not client-side

### Quota Management

1. **Track quota usage** with middleware
2. **Handle quota errors** gracefully
3. **Implement caching** to reduce quota usage
4. **Monitor quota metrics** in production
5. **Inform users** when quota exceeded

### Error Handling

1. **Use domain-specific errors** (FirebaseFirestoreError)
2. **Check error types** before handling
3. **Implement retry logic** for retryable errors
4. **Stop operations** for quota errors
5. **Log errors** appropriately

## 🚫 Forbidden Practices

### ❌ NEVER

- Access Firestore SDK directly in UI components
- Bypass repositories to access Firestore
- Create circular dependencies between modules
- Put business logic in UI components
- Use offset-based pagination (not scalable)
- Ignore quota tracking
- Hardcode collection paths
- Mix architectural layers

### ⚠️ Avoid

- Large queries without pagination
- Client-side filtering (use server queries)
- Not handling quota errors
- Skipping error handling
- Complex queries without indexes
- Duplicate queries (use deduplication middleware)

## 🏗️ Architecture

**Directory Structure:**

**domain/** - Business logic (Firestore-free)
- entities/ - Domain entities (RequestLog, QuotaMetrics)
- errors/ - Domain errors (FirebaseFirestoreError)
- constants/ - Constants (FREE_TIER_LIMITS, QUOTA_THRESHOLDS)

**infrastructure/** - Implementation (Firestore-dependent)
- repositories/ - Repository implementations (Base, Query, Paginated)
- middleware/ - Middleware (quota tracking, query deduplication)
- services/ - Services (request logger)
- config/ - Firestore initialization

**utils/** - Helper functions
- query-builder/ - Query building utilities
- pagination.helper/ - Pagination logic
- dateUtils/ - Date conversions
- path-resolver/ - Path resolution
- document-mapper.helper/ - Document transformation
- quota-error-detector/ - Error detection

## 🎯 Usage Strategies

### For Data Access

**Strategy:** Always use repositories, never access Firestore directly.

**Repository Selection:**
- **BaseRepository** - Simple CRUD operations
- **BaseQueryRepository** - Queries with filtering and sorting
- **BasePaginatedRepository** - Large datasets requiring pagination

**Approach:**
1. Create repository class extending appropriate base
2. Implement buildQuery() for query/paginated repositories
3. Use repository instance in UI or services
4. Handle errors appropriately

### For Pagination

**Strategy:** Use cursor-based pagination for scalability.

**When to Use:**
- Infinite scroll implementations
- Large datasets (>100 documents)
- Ordered result sets
- Mobile applications

**Approach:**
1. Extend BasePaginatedRepository
2. Implement buildQuery with cursor support
3. Use PaginatedResult type
4. Store cursor for next page in UI state

**Why Cursor-Based:**
- Scalable (doesn't skip documents)
- Consistent results
- Performance (doesn't scan skipped documents)
- Real-time friendly

### For Quota Management

**Strategy:** Track quota usage proactively and handle limits gracefully.

**When to Use:**
- All repository operations
- Production applications
- Free tier usage
- High-volume applications

**Approach:**
1. Register quotaTrackingMiddleware in repositories
2. Monitor metrics with quotaTrackingMiddleware.getMetrics()
3. Implement warning thresholds (80% of limit)
4. Handle quota errors with isQuotaError()
5. Inform users when quota exceeded

### For Query Optimization

**Strategy:** Build efficient queries that minimize quota usage.

**When to Use:**
- All query operations
- Large collections
- Complex filtering

**Approach:**
1. Use query builder for complex queries
2. Filter on server with where clauses
3. Use limit to control result size
4. Create composite indexes in Firebase Console
5. Use query deduplication middleware

## 🔧 Repository Types

### BaseRepository

**Purpose:** Basic CRUD operations for simple collections.

**When to Use:**
- Simple get/create/update/delete operations
- No complex filtering needed
- Small datasets

**Methods:**
- `findById(id)` - Get document by ID
- `create(data)` - Create new document
- `update(id, data)` - Update document
- `delete(id)` - Delete document
- `getAll()` - Get all documents (use with caution)
- `exists(id)` - Check if document exists

### BaseQueryRepository

**Purpose:** Advanced queries with filtering, sorting, and limits.

**When to Use:**
- Need to filter documents
- Need to sort results
- Need to limit result size
- Dynamic query building

**Methods:**
- `find(options)` - Query with options
- `findFirst(options)` - Get first matching document
- `count(options)` - Count matching documents
- `buildQuery(options)` - Build Firestore query (implement this)

**Required Implementation:**
- `buildQuery(options)` - Build query from options

### BasePaginatedRepository

**Purpose:** Cursor-based pagination for large datasets.

**When to Use:**
- Infinite scroll
- Large datasets (>100 documents)
- Ordered result sets
- Mobile applications

**Methods:**
- `paginate(options)` - Get paginated results
- `buildQuery(options, cursor?)` - Build query with cursor (implement this)

**Required Implementation:**
- `buildQuery(options, cursor?)` - Build query with cursor support

**Returns:**
- `PaginatedResult<T>` with items, hasMore, nextCursor

## 🔌 Middleware System

### Quota Tracking Middleware

**Purpose:** Automatically track quota usage for all operations.

**When to Use:**
- All repositories in production
- Free tier usage monitoring
- High-volume applications

**Approach:**
1. Import quotaTrackingMiddleware
2. Register in repository constructor
3. Monitor with getMetrics()
4. Handle threshold warnings

### Query Deduplication Middleware

**Purpose:** Prevent duplicate queries within time window.

**When to Use:**
- Frequently accessed data
- Rapid repeated queries
- Performance optimization

**Approach:**
1. Import queryDeduplicationMiddleware
2. Register in repository constructor
3. Duplicate queries return cached results
4. Configurable time window

### Custom Middleware

**Purpose:** Add custom logic to query execution.

**When to Use:**
- Logging
- Caching
- Error handling
- Performance monitoring

**Approach:**
1. Implement QueryMiddleware interface
2. Implement beforeQuery and/or afterQuery
3. Register in repository
4. Middleware runs in registration order

## 📊 Utilities

### Query Builder

**Location:** `utils/query-builder/`

**Purpose:** Build complex Firestore queries with filtering, sorting, pagination.

**When to Use:**
- Complex filtering requirements
- Date range queries
- Pagination with cursor
- Dynamic query building

**Key Features:**
- Automatic IN operator chunking (10-item limit)
- Date range filtering
- Cursor-based pagination
- Compound query support

### Pagination Helper

**Location:** `utils/pagination.helper/`

**Purpose:** Handle pagination logic and cursor extraction.

**When to Use:**
- Implementing cursor-based pagination
- Determining if more pages exist
- Extracting cursors from documents

**Key Features:**
- Type-safe generic implementation
- hasMore detection
- Cursor extraction
- Limit calculation

### Date Utilities

**Location:** `utils/dateUtils/`

**Purpose:** Convert between ISO strings and Firestore Timestamps.

**When to Use:**
- Storing dates in Firestore
- Reading dates from Firestore
- Query filters with dates

**Key Functions:**
- `getCurrentISOString()` - Current time
- `isoToTimestamp()` - ISO to Timestamp
- `timestampToISO()` - Timestamp to ISO
- `timestampToDate()` - Timestamp to Date

### Path Resolver

**Location:** `utils/path-resolver/`

**Purpose:** Standardized path resolution following `users/{userId}/{collectionName}` pattern.

**When to Use:**
- Creating user-specific collections
- Building repository paths
- Ensuring consistent path structure

**Required Pattern:**
- All user data: `users/{userId}/{collectionName}`
- Use FirestorePathResolver class
- Never construct paths manually

### Document Mapper

**Location:** `utils/document-mapper.helper/`

**Purpose:** Transform Firestore documents to domain entities.

**When to Use:**
- Separating document schema from entities
- Renaming fields (short names in Firestore)
- Type transformations

**Approach:**
1. Define document interface (Firestore schema)
2. Define entity interface (application model)
3. Create mapper with createDocumentMapper()
4. Use toEntity/toDocument methods

### Quota Error Detector

**Location:** `utils/quota-error-detector/`

**Purpose:** Detect and handle Firestore quota errors.

**When to Use:**
- Error handling in repositories
- Quota exceeded detection
- Retryable error detection

**Key Functions:**
- `isQuotaError(error)` - Check if quota error
- `isRetryableError(error)` - Check if retryable
- `getQuotaErrorMessage()` - User-friendly message

## 🤖 AI Agent Instructions

### When Creating Repository

1. Extend appropriate base class (Base, Query, or Paginated)
2. Implement required buildQuery method
3. Add custom methods as needed
4. Register middleware if needed
5. Handle errors appropriately
6. Keep file under 200 lines

### When Adding Query Logic

1. Use query builder utility
2. Respect Firestore limitations
3. Handle null/undefined options
4. Create indexes in Firebase Console
5. Document query requirements

### When Implementing Pagination

1. Extend BasePaginatedRepository
2. Implement buildQuery with cursor support
3. Use PaginationHelper for logic
4. Return PaginatedResult type
5. Store cursor in UI state

### When Modifying This Module

1. Read module-specific README first
2. Follow architectural patterns
3. Keep files under 200 lines
4. Update documentation
5. Add error handling

## 📏 Code Quality Standards

### File Size

- **Maximum:** 200 lines per file
- **Strategy:** Split large repositories into smaller modules
- **Example:** Split repository into base and query-specific files

### TypeScript

- Use strict mode
- Define proper types for all methods
- Export types used by other modules
- Never use `any` type
- Use generic type parameters for repositories

### Naming Conventions

- Files: `kebab-case.ts` (e.g., `user-repository.ts`)
- Classes: `PascalCase` (e.g., `UserRepository`)
- Functions/Variables: `camelCase` (e.g., `findById`)
- Interfaces/Types: `PascalCase` (e.g., `UserEntity`)

### Error Handling

1. Use FirebaseFirestoreError for Firestore errors
2. Include error codes for programmatic handling
3. Provide context in error messages
4. Never throw primitives
5. Log errors appropriately

## 🚨 Common Mistakes to Avoid

1. ❌ Accessing Firestore SDK directly in UI
   - ✅ Use repositories

2. ❌ Not implementing pagination for large datasets
   - ✅ Use BasePaginatedRepository

3. ❌ Ignoring quota tracking
   - ✅ Register quotaTrackingMiddleware

4. ❌ Client-side filtering
   - ✅ Use server-side queries

5. ❌ Not handling quota errors
   - ✅ Use isQuotaError() and handle appropriately

## 📚 Related Documentation

- [Development Guidelines](../../CONTRIBUTING.md)
- [Repository Documentation](./infrastructure/repositories/README.md)
- [Middleware Documentation](./infrastructure/middleware/README.md)
- [Query Builder](./utils/query-builder/README.md)
- [Pagination Helper](./utils/pagination.helper/README.md)
- [Path Resolver](./utils/path-resolver/README.md)
- [Firestore Index Management](https://firebase.google.com/docs/firestore/query-data/indexing)

## 🔗 API Reference

### Main Exports

**Repositories:**
- `BaseRepository<T>` - Basic CRUD operations
- `BaseQueryRepository<T, O>` - Query with filtering
- `BasePaginatedRepository<T, O>` - Pagination support

**Middleware:**
- `quotaTrackingMiddleware` - Track quota usage
- `queryDeduplicationMiddleware` - Prevent duplicate queries

**Utilities:**
- `buildQuery()` - Build Firestore queries
- `createDocumentMapper()` - Document transformation
- `FirestorePathResolver` - Path resolution
- PaginationHelper - Pagination logic
- Date utilities - Date/timestamp conversion
- Quota error detector - Error detection

**Services:**
- `requestLoggerService` - Log Firestore requests

**Types:**
- `PaginatedResult<T>` - Pagination result type
- `PaginationParams` - Pagination parameters
- `QuotaMetrics` - Quota usage metrics
- `FirebaseFirestoreError` - Firestore error class

## 🎓 Key Concepts

### Repository Pattern

**Why Repository Pattern?**
- Abstracts Firestore implementation details
- Makes code testable without Firestore
- Centralizes data access logic
- Easier to modify or replace data source

**How it works:**
1. Repository defines data operations interface
2. Base repository provides standard implementations
3. Custom repositories extend and specialize
4. UI uses repositories, not Firestore directly

### Cursor-Based Pagination

**Why Cursor-Based?**
- Offset-based doesn't scale (scans all skipped documents)
- Cursor-based starts from specific position
- Consistent results (no missing/duplicates)
- Better performance

**How it works:**
1. Fetch limit + 1 documents
2. If returned > limit, hasMore = true
3. Use last document as cursor for next page
4. Pass cursor in subsequent requests

### Middleware Pattern

**Why Middleware?**
- Cross-cutting concerns (logging, quota tracking)
- Separation of concerns
- Composable behavior
- Easy to add/remove

**How it works:**
1. Middleware registered in repository
2. beforeQuery runs before query execution
3. afterQuery runs after query execution
4. Multiple middleware chain together

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
