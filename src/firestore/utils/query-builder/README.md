# Query Builder

Advanced Firestore query building utility with support for filtering, sorting, pagination, and date ranges.

## Purpose

Provides a fluent interface for building complex Firestore queries while handling Firestore limitations (e.g., IN operator 10-item limit).

## For AI Agents

### Before Using Query Builder

1. **UNDERSTAND** Firestore query limitations
2. **USE** builder instead of raw Firestore queries
3. **RESPECT** compound query limitations
4. **HANDLE** large arrays with chunking

### Required Practices

1. **Use query builder** for complex queries
2. **Handle IN operator limits** (max 10 values)
3. **Apply modifiers in correct order** (filters → date range → sort → cursor → limit)
4. **Use pagination** for large datasets

### Forbidden Practices

## ❌ NEVER

- Build queries manually with Firestore SDK
- Use IN operator with more than 10 values without chunking
- Apply modifiers in wrong order
- Create compound queries that violate Firestore rules
- Ignore pagination for large result sets

## ⚠️ Avoid

- Multiple range filters on different fields
- Sorting + filtering on different fields without composite index
- Very large IN arrays (use pagination instead)
- Complex OR queries (performance impact)

## Usage Strategies

### For Complex Filtering

**Strategy:** Use FieldFilter array for multiple conditions.

**When to Use:**
- Filtering by multiple fields
- Combining equality and range filters
- Building dynamic queries based on user input

**Approach:**
1. Create FieldFilter objects for each condition
2. Add to baseFilters array
3. Pass to buildQuery with other options

### For Date Range Queries

**Strategy:** Use dateRange option for time-based filtering.

**When to Use:**
- Filtering by creation/update time
- Date-based analytics queries
- Time-series data retrieval

**Approach:**
1. Specify field name (e.g., 'createdAt')
2. Provide startDate and/or endDate as timestamps
3. Combine with sorting on same field

### For Pagination

**Strategy:** Use cursorValue with limit for cursor-based pagination.

**When to Use:**
- Infinite scroll implementations
- Large dataset navigation
- Ordered result sets

**Approach:**
1. Store cursor from last page
2. Pass as cursorValue in next request
3. Always use with sort and limit

### For Large IN Arrays

**Strategy:** Let builder handle chunking automatically.

**When to Use:**
- Filtering by list of IDs
- Multiple category selection
- Tag-based filtering

**Approach:**
1. Create filter with operator: 'in'
2. Pass array (any size supported)
3. Builder splits into chunks of 10 automatically

## Configuration Options

### QueryBuilderOptions

**collectionName** (required)
- Target collection path
- Type: string

**baseFilters** (optional)
- Array of field filters
- Type: FieldFilter[]
- Applied first in query chain

**dateRange** (optional)
- Date range filter
- Type: { field: string; startDate?: number; endDate?: number }
- Use Timestamps for dates

**sort** (optional)
- Sort configuration
- Type: { field: string; order?: 'asc' | 'desc' }
- Defaults to 'desc' if not specified

**limitValue** (optional)
- Maximum documents to return
- Type: number
- Use for pagination and performance

**cursorValue** (optional)
- Pagination cursor (timestamp)
- Type: number
- Requires sort to be set

### FieldFilter

**field** (required)
- Document field to filter on
- Type: string

**operator** (required)
- Comparison operator
- Type: WhereFilterOp (==, !=, >, >=, <, <=, in, array-contains)

**value** (required)
- Filter value
- Type: string | number | boolean | string[] | number[]

## Helper Functions

**Import from:** `src/firestore/utils/query-builder`

### `createInFilter(field, values)`

Create filter for IN operator.

**Use For:**
- Filtering by multiple values
- ID list queries
- Category/tag filtering

**Note:** Automatically chunks arrays larger than 10 values.

### `createEqualFilter(field, value)`

Create filter for equality comparison.

**Use For:**
- Single value matches
- ID lookups
- Status filtering

## Query Building Order

**REQUIRED ORDER:** Modifiers must be applied in this sequence:

1. **Collection reference** (base)
2. **Base filters** (where clauses)
3. **Date range** (>= and <=)
4. **Sort** (orderBy)
5. **Cursor** (startAfter)
6. **Limit** (limit)

**Why this order?**
- Firestore requires specific order for composite queries
- Filters before sorts
- Sorts before cursors
- Cursors before limits

## Common Mistakes to Avoid

1. ❌ Manual query construction
   - ✅ Use buildQuery utility

2. ❌ IN operator with 11+ values without chunking
   - ✅ Builder handles this automatically

3. ❌ Wrong modifier order
   - ✅ Follow prescribed order in buildQuery

4. ❌ Pagination without sort
   - ✅ Always include sort when using cursor

5. ❌ Multiple range filters on different fields
   - ✅ Use single range filter or create composite index

## AI Agent Instructions

### When Adding Query Features

1. Check Firestore limitations first
2. Handle edge cases (null, undefined, empty arrays)
3. Document query capabilities
4. Update this README

### When Building Queries

1. Use buildQuery, not raw Firestore SDK
2. Handle IN operator limits (10 items max per clause)
3. Respect composite query requirements
4. Always paginate large result sets
5. Create composite indexes in Firebase Console when needed

### For Complex Queries

1. Break into multiple queries if needed
2. Consider client-side filtering for complex logic
3. Use denormalization for better query patterns
4. Document query requirements

## Code Quality Standards

### TypeScript

- All options must have explicit types
- Export types for consumer use
- Use strict type checking
- Document generic type parameters

### Error Handling

- Validate required options
- Provide clear error messages
- Handle Firestore limitations gracefully
- Log warnings for anti-patterns

## Performance Considerations

### Query Optimization

1. **Limit results** always use limitValue
2. **Create indexes** for composite queries
3. **Avoid large offsets** use cursor-based pagination
4. **Select specific fields** when possible (future feature)

### Quota Management

1. Each query reads all matched documents
2. Use limit to control reads
3. Date range filters reduce scanned documents
4. Monitor query performance in Firebase Console

## Related Documentation

- [Firestore Module README](../README.md)
- [Repository README](../../infrastructure/repositories/README.md)
- [Pagination Helper README](../pagination.helper/README.md)
- [Date Utilities README](../dateUtils/README.md)

## Firebase Query Limitations

### Composite Queries

- Maximum 1 range filter (<, <=, >, >=)
- Range filter and sort must be on same field
- Requires composite index for most combinations

### IN Operator

- Maximum 10 values per query
- Builder auto-chunks larger arrays
- Each chunk counts as separate query for quota

### OR Queries

- Maximum 30 disjunctions
- Can impact performance
- Use sparingly

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
