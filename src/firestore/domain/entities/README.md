# Request Log Types

TypeScript types for Firestore request logging and tracking.

## Purpose

Provides type definitions for logging Firestore requests including request types, logs, and statistics. Used for monitoring, analytics, and quota tracking.

## For AI Agents

### Before Using Request Log Types

1. **USE** types for type-safe request logging
2. **LOG** all Firestore operations for monitoring
3. **TRACK** quota usage with request logs
4. **ANALYZE** logs for performance optimization
5. **NEVER** log sensitive user data in requests

### Required Practices

1. **Log all Firestore operations** with RequestLog
2. **Use RequestType** for operation categorization
3. **Calculate statistics** with RequestStats
4. **Import types from correct path**
5. **Use queryHash for duplicate detection**

### Forbidden Practices

## ❌ NEVER

- Log sensitive user data in request logs
- Log request payloads or document content
- Ignore logging for Firestore operations
- Use request logs for debugging only (also for analytics)
- Store logs indefinitely (cleanup old logs)

## ⚠️ Avoid

- Logging every single read operation (use sampling)
- Not cleaning up old logs
- Logging in production without monitoring
- Storing logs in production database
- Complex logging logic in critical path

## Usage Strategies

### For Request Logging

**Strategy:** Log every Firestore operation for monitoring and quota tracking.

**Import From:** `src/firestore/domain/entities`

**When to Use:**
- Repository operations (read, write, delete)
- Quota tracking middleware
- Performance monitoring
- Analytics and reporting

**Logging Strategy:**
1. Create RequestLog before operation
2. Set operation type (read/write/delete)
3. Record collection name
4. Count affected documents
5. Add timestamp and query hash
6. Log operation completion

### For Quota Tracking

**Strategy:** Use request logs to track Firestore quota usage.

**Import From:** `src/firestore/domain/entities`

**When to Use:**
- Monitoring quota consumption
- Warning threshold detection
- Usage analytics
- Cost optimization

**Tracking Metrics:**
- Total read operations
- Total write operations
- Total delete operations
- Average document count per request
- Request rate over time

### For Analytics

**Strategy:** Analyze request logs for performance insights.

**Import From:** `src/firestore/domain/entities`

**When to Use:**
- Performance monitoring
- Query optimization
- Usage patterns analysis
- Cost optimization

**Analytics Metrics:**
- Most queried collections
- Average document counts
- Request frequency
- Query patterns (via queryHash)

## Type Definitions

### RequestLog

**Import From:** `src/firestore/domain/entities`

**Purpose:** Log entry for a Firestore request

**Properties:**
- `type: RequestType` - Type of operation (read/write/delete)
- `collectionName: string` - Collection being accessed
- `documentCount: number` - Number of documents affected
- `timestamp: number` - Unix timestamp of request
- `queryHash?: string` - Hash of query for duplicate detection

**Usage:**
- Create log entry before Firestore operation
- Populate with operation details
- Store for analytics and monitoring
- Use queryHash for deduplication

### RequestType

**Import From:** `src/firestore/domain/entities`

**Purpose:** Type of Firestore request

**Values:**
- `'read'` - Query/get operations
- `'write'` - Create/update operations
- `'delete'` - Delete operations

**Usage:**
- Categorize operations for quota tracking
- Separate read/write/delete costs
- Filter logs by operation type
- Generate statistics by type

### RequestStats

**Import From:** `src/firestore/domain/entities`

**Purpose:** Statistics summary for Firestore requests

**Properties:**
- `totalReads: number` - Total read operations
- `totalWrites: number` - Total write operations
- `totalDeletes: number` - Total delete operations
- `totalRequests: number` - Total all operations
- `avgDocCount: number` - Average documents per request

**Usage:**
- Calculate from array of RequestLog
- Display usage statistics
- Monitor quota consumption
- Generate reports

## Helper Functions

### Creating Request Logs

**Strategy:** Create log entry before each Firestore operation.

**Properties to Set:**
1. `type` - Operation type (read/write/delete)
2. `collectionName` - Target collection
3. `documentCount` - Affected document count
4. `timestamp` - Current timestamp
5. `queryHash` - Optional query identifier

**When to Create:**
- Before repository query execution
- In middleware before operation
- After operation completes
- On operation errors (log failed attempt)

### Calculating Statistics

**Strategy:** Aggregate RequestLog array into RequestStats.

**Calculation:**
1. Filter logs by type for each count
2. Sum document counts
3. Calculate average document count
4. Return statistics object

**When to Calculate:**
- On-demand statistics display
- Periodic reporting (daily/weekly)
- After quota threshold warning
- Performance monitoring

## Common Mistakes to Avoid

1. ❌ Logging sensitive data in request logs
   - ✅ Only log operation metadata

2. ❌ Not logging all operations
   - ✅ Log every Firestore operation

3. ❌ Storing logs indefinitely
   - ✅ Clean up old logs regularly

4. ❌ Not using types
   - ✅ Always use RequestLog type

5. ❌ Logging in production database
   - ✅ Use logging service or external tool

## AI Agent Instructions

### When Adding Request Logging

1. Import types from `src/firestore/domain/entities`
2. Create RequestLog before each operation
3. Populate all required fields
4. Include queryHash for duplicates
5. Log operation completion

### When Calculating Statistics

1. Collect all RequestLog entries
2. Filter by type for counts
3. Calculate aggregates
4. Return RequestStats object
5. Handle empty log array

### When Using for Analytics

1. Export logs periodically
2. Analyze query patterns
3. Identify most accessed collections
4. Detect performance issues
5. Generate usage reports

## Performance Considerations

### Logging Overhead

**Minimal Impact:**
- Type checking at compile time (not runtime)
- Simple object creation
- No complex transformations
- Acceptable for all operations

### Storage Strategy

**Don't Store in Production Database:**
- Use external logging service
- Export logs for analysis
- Keep logs in memory temporarily
- Aggregate before storage

### Log Cleanup

**Regular Cleanup:**
- Remove logs older than retention period
- Aggregate before deletion
- Keep statistics for long-term
- Compress old logs if needed

## Related Documentation

- [Firestore Module README](../../README.md)
- [Request Logger Service README](../../infrastructure/services/request-logger-service/README.md)
- [Quota Tracking README](../../infrastructure/middleware/quota-tracking/README.md)

## API Reference

### Main Types

**Import Path:** `src/firestore/domain/entities`

| Type | Purpose | Properties |
|------|---------|------------|
| `RequestLog` | Single request log | type, collectionName, documentCount, timestamp, queryHash |
| `RequestType` | Operation type | 'read' \| 'write' \| 'delete' |
| `RequestStats` | Usage statistics | totalReads, totalWrites, totalDeletes, totalRequests, avgDocCount |

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
