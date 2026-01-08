# Date Utilities

Utility functions for converting between ISO strings, JavaScript Dates, and Firestore Timestamps.

## Purpose

Provides type-safe conversions for date/time handling between application code and Firestore storage. Ensures consistent date format handling across the application.

## For AI Agents

### Before Using Date Utilities

1. **USE** these utilities instead of manual conversions
2. **STORE** dates as ISO strings in Firestore
3. **CONVERT** Timestamps when reading from Firestore
4. **HANDLE** null/undefined cases appropriately

### Required Practices

1. **Always use utilities** for date conversions
2. **Store as ISO strings** in Firestore documents
3. **Convert on read** when retrieving from Firestore
4. **Handle edge cases** (null, undefined, invalid dates)

### Forbidden Practices

## ❌ NEVER

- Manual date/timestamp conversion logic
- Store Date objects directly in Firestore
- Store Timestamp objects in documents
- Assume timestamps are always valid
- Mix date formats (some ISO, some Timestamp)

## ⚠️ Avoid

- Time zone conversions (use UTC everywhere)
- Locale-specific date formatting
- Date arithmetic (use libraries like date-fns)
- Inconsistent date formats across collections

## Usage Strategies

### For Firestore Documents

**Strategy:** Store dates as ISO strings in Firestore, convert when reading.

**When to Use:**
- Creating documents with date fields
- Reading documents with Timestamp fields
- Comparing dates in queries

**Approach:**
1. Use `getCurrentISOString()` for current time
2. Use `isoToTimestamp()` when querying with dates
3. Use `timestampToISO()` when reading from Firestore
4. Use `timestampToDate()` for Date operations

### For Query Filtering

**Strategy:** Use Timestamp conversions for date range queries.

**When to Use:**
- Filtering documents by date range
- Sorting by date fields
- Comparing dates in where clauses

### For Display

**Strategy:** Convert to Date object for UI formatting.

**When to Use:**
- Displaying dates in UI components
- Formatting dates for users
- Date manipulation in business logic

## Function Reference

### `getCurrentISOString(): string`

Returns current date/time as ISO string.

**Use For:**
- Setting createdAt timestamps
- Setting updatedAt timestamps
- Current date/time storage

### `isoToTimestamp(isoString: string): Timestamp`

Converts ISO string to Firestore Timestamp.

**Use For:**
- Query filters with dates
- Date comparisons in queries
- Timestamp-based operations

### `timestampToISO(timestamp: Timestamp): string`

Converts Firestore Timestamp to ISO string.

**Use For:**
- Reading dates from Firestore
- Storing timestamps as ISO strings
- Consistent date format

### `timestampToDate(timestamp: Timestamp): Date`

Converts Firestore Timestamp to JavaScript Date.

**Use For:**
- UI date formatting
- Date manipulation
- Date calculations

## Common Mistakes to Avoid

1. ❌ Storing Date objects directly in Firestore
   - ✅ Use ISO strings via `getCurrentISOString()`

2. ❌ Manual timestamp conversion
   - ✅ Use `isoToTimestamp()` and `timestampToISO()`

3. ❌ Inconsistent date formats
   - ✅ Always use ISO strings for storage

4. ❌ Not handling null timestamps
   - ✅ Utilities handle null cases with defaults

## AI Agent Instructions

### When Adding Date Operations

1. Check if utility already exists
2. Add to this file if date-related
3. Handle null/undefined cases
4. Return consistent types
5. Update this README

### When Working with Dates

1. Always use these utilities
2. Don't create custom date logic
3. Handle time zones consistently (UTC)
4. Document date format expectations

## Code Quality Standards

### TypeScript

- All functions must have explicit types
- Handle null/undefined parameters
- Return consistent types
- Export for use across modules

### Error Handling

- Provide default values for null inputs
- Never throw for invalid dates
- Handle timezone differences
- Log warnings for edge cases

## Related Documentation

- [Firestore Module README](../README.md)
- [Query Builder README](../query-builder/README.md)
- [Repository README](../../infrastructure/repositories/README.md)

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
