# Firestore Middleware

Middleware system for Firestore query operations providing request/response processing, quota tracking, and query deduplication.

## Purpose

Provides middleware system for intercepting and processing Firestore operations before and after execution, including query deduplication, quota tracking, and custom middleware support.

## For AI Agents

### Before Using Middleware

1. **REGISTER** middleware in repository constructor
2. **IMPLEMENT** QueryMiddleware interface for custom middleware
3. **USE** built-in middleware when possible
4. **CONSIDER** performance impact
5. **ORDER** middleware correctly (execution order matters)

### Required Practices

1. **Register middleware** - Add in repository constructor
2. **Order middleware** - Execution order matters
3. **Use built-in middleware** - Don't recreate existing functionality
4. **Keep middleware focused** - Single responsibility
5. **Handle errors** - Middleware should handle errors gracefully

### Forbidden Practices

## ❌ NEVER

- Register middleware after repository construction
- Mix unrelated concerns in one middleware
- Skip middleware in error cases
- Use middleware for business logic
- Block execution indefinitely

## ⚠️ Avoid

- Too much middleware (2-3 max per repository)
- Async operations in beforeQuery
- Complex logic in middleware
- Not handling errors
- Ignoring execution order

## Middleware Pattern

### QueryMiddleware Interface

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/middleware`

**Purpose:** Interface for all query middleware

**Methods:**
- `beforeQuery?(options)` - Process before query execution
- `afterQuery?(result, options)` - Process after query execution

**Usage:**
- Implement for custom middleware
- Register in repository constructor
- Process options before query
- Transform results after query

**Execution Order:**
1. All beforeQuery hooks (in registration order)
2. Query execution
3. All afterQuery hooks (in registration order)

## Built-in Middleware

### Query Deduplication Middleware

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/middleware`

**Purpose:** Prevent duplicate queries by caching results

**Import:** `queryDeduplicationMiddleware` or `QueryDeduplicationMiddleware` class

**Configuration Options:**
- `cacheTimeout?: number` - Cache duration in ms (default: 1000)
- `enableLogging?: boolean` - Enable debug logging (default: false)

**Strategy:**
1. First query executes and caches result
2. Identical query within timeout returns cached result
3. Uses query hash for comparison
4. Reduces Firestore quota usage
5. Improves performance

**When to Use:**
- Rapid duplicate queries
- Multiple components querying same data
- Reducing quota usage
- Performance optimization

**Benefits:**
- Prevents over-fetching
- Reduces quota usage
- Instant response for cached queries
- Optimistic UI support

**Custom Configuration:**
- Adjust cacheTimeout for your use case
- Enable logging in development
- Longer timeout = more caching but stale data risk
- Default 1 second balance

### Quota Tracking Middleware

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/middleware`

**Purpose:** Track Firestore quota usage for all queries

**Import:** `quotaTrackingMiddleware`

**Tracks:**
- Read operations
- Write operations
- Delete operations
- Document counts per operation

**Strategy:**
1. Intercepts all repository operations
2. Counts affected documents
3. Tracks operation types
4. Logs quota usage
5. Can trigger warnings

**When to Use:**
- Monitoring quota usage
- Cost optimization
- Usage analytics
- Performance tracking

**Benefits:**
- Real-time quota tracking
- Cost awareness
- Usage optimization
- Warning system

## Custom Middleware

### Creating Custom Middleware

**Strategy:** Implement QueryMiddleware interface for custom behavior.

**Import From:** Extend QueryMiddleware from `src/firestore/infrastructure/middleware`

**When to Use:**
- Custom query logging
- Request modification
- Response transformation
- Error handling
- Analytics tracking

**Implementation:**
1. Implement QueryMiddleware interface
2. Add beforeQuery method (optional)
3. Add afterQuery method (optional)
4. Return modified options/results
5. Handle errors appropriately

**Use Cases:**
- Add query parameters globally
- Modify query options
- Transform results
- Log query details
- Track analytics

### Middleware Registration

**Strategy:** Register middleware in repository constructor.

**Import From:** Repository's registerMiddleware method

**When to Register:**
- Repository construction
- Before any queries
- In constructor only

**Registration Order:**
- Order matters for execution
- First registered = first executed
- Consider dependencies between middleware
- Deduplication usually first
- Quota tracking usually last

## Common Mistakes to Avoid

1. ❌ Registering middleware after construction
   - ✅ Always register in constructor

2. ❌ Too much middleware
   - ✅ Limit to 2-3 per repository

3. ❌ Complex logic in middleware
   - ✅ Keep middleware focused

4. ❌ Not handling errors
   - ✅ Handle errors gracefully

5. ❌ Ignoring execution order
   - ✅ Order middleware correctly

## AI Agent Instructions

### When Using Built-in Middleware

1. Import from firestore module
2. Register in repository constructor
3. Configure if needed (timeout, logging)
4. Consider execution order
5. Test middleware behavior

### When Creating Custom Middleware

1. Implement QueryMiddleware interface
2. Keep it focused (single responsibility)
3. Handle both success and error cases
4. Return modified options/results
5. Document middleware behavior

### When Registering Middleware

1. Register in repository constructor
2. Order middleware correctly
3. Consider dependencies
4. Don't register too many
5. Test execution order

## Code Quality Standards

### TypeScript

- Implement QueryMiddleware interface
- Type all parameters and returns
- Handle errors with proper types
- Export middleware functions
- Document middleware behavior

### Performance

- Keep middleware lightweight
- Avoid async in beforeQuery
- Cache expensive operations
- Don't block execution
- Monitor overhead

### Testing

- Test middleware in isolation
- Test execution order
- Test error handling
- Test configuration options
- Test edge cases

## Performance Considerations

### Middleware Overhead

- Each middleware adds small overhead
- 2-3 middleware is acceptable
- More middleware = more overhead
- Profile performance in production
- Remove unused middleware

### Caching Strategy

**Query Deduplication:**
- Default 1 second cache
- Longer cache = more stale data risk
- Shorter cache = less benefit
- Adjust based on use case
- Monitor cache hit rate

### Quota Tracking

- Minimal overhead
- Counting operations only
- No network calls
- Safe for production
- Useful for optimization

## Related Documentation

- [Firestore Module README](../../README.md)
- [Repositories README](../repositories/README.md)
- [Quota Error Detector README](../../utils/quota-error-detector/README.md)
- [Request Log Types README](../../domain/entities/README.md)

## API Reference

### Built-in Middleware

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/middleware`

| Middleware | Purpose | Configuration |
|-----------|---------|--------------|
| `queryDeduplicationMiddleware` | Cache duplicate queries | `cacheTimeout?, enableLogging?` |
| `quotaTrackingMiddleware` | Track quota usage | None (auto-configured) |

### QueryMiddleware Interface

**Interface Definition:**

QueryMiddleware interface with two optional methods:
- beforeQuery(options): Called before query execution
- afterQuery(result, options): Called after query execution

**Methods:**
- `beforeQuery` - Called before query execution
- `afterQuery` - Called after query execution

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
