# Request Logger Service

Service for logging and tracking Firestore requests with statistics and analytics.

## Purpose

Provides comprehensive logging capabilities for Firestore operations including request tracking, statistics calculation, query hashing, log export, and analytics.

## For AI Agents

### Before Using Request Logger

1. **LOG** all Firestore operations for monitoring
2. **TRACK** quota usage with request logs
3. **CALCULATE** statistics from logs
4. **EXPORT** logs for analysis
5. **CLEANUP** old logs regularly

### Required Practices

1. **Log all operations** - Log every Firestore operation
2. **Use RequestLog type** - Type-safe log entries
3. **Calculate statistics** - Use getStats() method
4. **Export logs** - Export for offline analysis
5. **Clean up old logs** - Remove logs periodically

### Forbidden Practices

## ❌ NEVER

- Log sensitive user data in requests
- Log request payloads or document content
- Store logs indefinitely without cleanup
- Log in production database (use external service)
- Ignore logging for debugging

## ⚠️ Avoid

- Logging every single read operation (use sampling)
- Not cleaning up old logs
- Logging in production without monitoring
- Complex logging logic in critical path
- Storing logs in production database

## Service Methods

### logRequest

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

**Purpose:** Log a Firestore operation

**Parameters:** `RequestLog` object
- `type: RequestType` - Operation type ('read', 'write', 'delete')
- `collectionName: string` - Collection being accessed
- `documentCount: number` - Number of documents affected
- `timestamp: number` - Unix timestamp
- `queryHash?: string` - Hash for duplicate detection

**Returns:** `void`

**Usage Strategy:**
1. Create RequestLog before operation
2. Call logRequest() with log data
3. Include queryHash for duplicates
4. Log after operation completes
5. Handle errors appropriately

**When to Use:**
- All repository read operations
- All repository write operations
- All repository delete operations
- Quota tracking
- Performance monitoring

### getLogs

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

**Purpose:** Retrieve all logged requests

**Returns:** `RequestLog[]` - Array of all log entries

**Usage Strategy:**
1. Call getLogs() to retrieve logs
2. Analyze log patterns
3. Calculate statistics
4. Export for analysis
5. Display to users if needed

**When to Use:**
- Analyzing usage patterns
- Calculating statistics
- Exporting logs
- Debugging issues
- Monitoring quota

### getStats

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

**Purpose:** Calculate usage statistics from logs

**Returns:** `RequestStats` object
- `totalReads: number` - Total read operations
- `totalWrites: number` - Total write operations
- `totalDeletes: number` - Total delete operations
- `totalRequests: number` - Total all operations
- `avgDocCount: number` - Average documents per request

**Usage Strategy:**
1. Call getStats() to calculate statistics
2. Display statistics to users
3. Check quota usage
4. Monitor trends
5. Generate reports

**When to Use:**
- Displaying quota usage
- Monitoring performance
- Cost analysis
- Usage trends
- Before large operations

### clearLogs

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

**Purpose:** Remove all logged requests

**Returns:** `void`

**Usage Strategy:**
1. Export logs before clearing
2. Call clearLogs() to reset
3. Schedule periodic cleanup
4. Clear after exporting
5. Confirm before clearing

**When to Use:**
- Periodic log cleanup
- After exporting logs
- Free up memory
- Start fresh tracking
- Privacy requirements

## Usage Strategies

### For Quota Tracking

**Strategy:** Use request logs to track Firestore quota usage.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

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

**Implementation:**
1. Log all Firestore operations
2. Calculate statistics periodically
3. Check quota thresholds
4. Display usage to users
5. Warn when approaching limits

### For Analytics

**Strategy:** Analyze request logs for performance insights.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

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

**Implementation:**
1. Collect logs over time period
2. Analyze collection access patterns
3. Identify heavy queries
4. Optimize based on findings
5. Generate reports

### For Debugging

**Strategy:** Use request logs to debug Firestore operations.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

**When to Use:**
- Investigating performance issues
- Debugging quota spikes
- Identifying problematic queries
- Tracking operation failures

**Debugging Approach:**
1. Enable request logging
2. Reproduce issue
3. Review logs for operations
4. Identify problematic patterns
5. Fix and verify

## Common Mistakes to Avoid

1. ❌ Logging sensitive user data
   - ✅ Only log operation metadata

2. ❌ Not logging all operations
   - ✅ Log every Firestore operation

3. ❌ Storing logs indefinitely
   - ✅ Clean up old logs regularly

4. ❌ Not using types
   - ✅ Always use RequestLog type

5. ❌ Logging in production database
   - ✅ Use external logging service

## AI Agent Instructions

### When Logging Requests

1. Create RequestLog before operation
2. Populate all required fields
3. Include queryHash for duplicates
4. Call logRequest() method
5. Handle errors appropriately

### When Calculating Statistics

1. Collect logs over time period
2. Call getStats() method
3. Display statistics appropriately
4. Check quota thresholds
5. Generate reports

### When Exporting Logs

1. Call getLogs() to retrieve
2. Export to CSV/JSON
3. Store externally (not in database)
4. Clear logs after export
5. Schedule regular exports

## Code Quality Standards

### TypeScript

- Use RequestLog type for all logs
- Use RequestType for operation types
- Type all method parameters
- Type all return values
- Export types for use in other modules

### Error Handling

- Wrap logging in try-catch
- Don't let logging break operations
- Log logging failures
- Handle edge cases
- Test error scenarios

## Performance Considerations

### Logging Overhead

- Minimal performance impact
- In-memory logging (fast)
- Type checking at compile time
- No network calls
- Acceptable for all operations

### Storage Strategy

**Don't Store in Production Database:**
- Use external logging service
- Export logs for analysis
- Keep logs in memory temporarily
- Aggregate before storage
- Clean up regularly

### Log Cleanup

**Regular Cleanup:**
- Remove logs older than retention period
- Aggregate before deletion
- Keep statistics for long-term
- Compress old logs if needed
- Schedule automatic cleanup

## Related Documentation

- [Firestore Module README](../../README.md)
- [Request Log Types README](../../domain/entities/README.md)
- [Quota Tracking README](../middleware/README.md)

## API Reference

### Main Service

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/services`

**Service:** `requestLoggerService`

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `logRequest` | `RequestLog` | `void` | Log a Firestore operation |
| `getLogs` | - | `RequestLog[]` | Get all logged requests |
| `getStats` | - | `RequestStats` | Calculate usage statistics |
| `clearLogs` | - | `void` | Clear all logged requests |

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
