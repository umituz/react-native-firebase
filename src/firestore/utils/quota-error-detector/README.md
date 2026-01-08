# Quota Error Detector

Utilities for detecting and handling Firestore quota errors and retryable errors.

## Purpose

Provides reliable detection of Firestore quota errors (resource-exhausted, quota-exceeded) and retryable transient errors (unavailable, deadline-exceeded) for proper error handling and user communication.

## For AI Agents

### Before Using Error Detection

1. **ALWAYS** wrap Firestore operations in try-catch
2. **CHECK** error type before handling
3. **PROVIDE** user-friendly messages for quota errors
4. **IMPLEMENT** retry logic for retryable errors
5. **LOG** errors appropriately

### Required Practices

1. **Use isQuotaError()** for quota detection
2. **Use getQuotaErrorMessage()** for user-facing messages
3. **Use isRetryableError()** for retry logic
4. **Handle quota errors gracefully** (stop operations, inform user)
5. **Implement exponential backoff** for retryable errors

### Forbidden Practices

## ❌ NEVER

- Ignore quota errors (continue operations)
- Show raw error messages to users
- Retry quota errors (won't succeed)
- Assume all errors are quota errors
- Log sensitive error data

## ⚠️ Avoid

- Too many retries (implement max retry limit)
- No delay between retries (use backoff)
- Confusing retryable with quota errors
- Not tracking quota usage
- Blocking UI for retryable errors

## Usage Strategies

### For Quota Error Handling

**Strategy:** Detect quota errors and stop operations immediately.

**When to Use:**
- After Firestore write operations
- After Firestore read operations (if quota-limited)
- In error boundaries
- In background sync operations

**Approach:**
1. Catch errors from Firestore operations
2. Check with isQuotaError()
3. Show user-friendly message
4. Disable operations that consume quota
5. Track quota exceeded state

**User Message Strategy:**
- Inform user clearly about quota limit
- Suggest upgrade plan or waiting
- Provide action buttons (upgrade, contact support)
- Don't show technical details

### For Retryable Error Handling

**Strategy:** Implement retry logic with exponential backoff.

**When to Use:**
- Network timeout errors
- Temporary service unavailability
- Deadline exceeded errors
- Automatic retry operations

**Approach:**
1. Check with isRetryableError()
2. Wait with exponential backoff (1s, 2s, 4s, 8s...)
3. Retry operation
4. Max retries: 3-5
5. Give up after max retries

**Exponential Backoff:**
- Retry 1: Wait 1 second
- Retry 2: Wait 2 seconds
- Retry 3: Wait 4 seconds
- Retry 4: Wait 8 seconds
- Max: 5 retries

### For Error Logging

**Strategy:** Log errors appropriately based on type.

**When to Use:**
- Monitoring error rates
- Debugging issues
- Analytics and alerting

**Approach:**
1. Log retryable errors as warnings
2. Log quota errors as errors
3. Include error context (operation, collection)
4. Don't log sensitive data (user data, tokens)
5. Aggregate error metrics

## Error Detection Logic

### Quota Error Detection

**isQuotaError(error)** checks for:

**Error Codes:**
- `resource-exhausted`
- `quota-exceeded`
- `RESOURCE_EXHAUSTED`

**Error Messages:**
- "quota"
- "exceeded"
- "limit"
- "too many requests"

**Detection Strategy:**
1. Check error.code for known quota codes
2. Check error.message for quota-related keywords
3. Case-insensitive message matching

### Retryable Error Detection

**isRetryableError(error)** checks for:

**Error Codes:**
- `unavailable` - Service temporarily unavailable
- `deadline-exceeded` - Request timeout
- `aborted` - Operation cancelled (can retry)

**Detection Strategy:**
1. Check error.code for retryable codes
2. Only code-based detection (more reliable)
3. Conservative (only retry if safe)

## API Reference

### `isQuotaError(error: unknown): boolean`

Check if error is a Firestore quota error.

**Parameters:**
- **error**: unknown - Error object from Firestore operation

**Returns:** boolean - True if quota error detected

**Use For:**
- Detecting quota exceeded
- Stopping operations
- Showing user messages

### `isRetryableError(error: unknown): boolean`

Check if error is retryable (transient).

**Parameters:**
- **error**: unknown - Error object from Firestore operation

**Returns:** boolean - True if error is retryable

**Use For:**
- Implementing retry logic
- Background sync operations
- Automatic recovery

### `getQuotaErrorMessage(): string`

Get user-friendly quota error message.

**Returns:** string - User-facing error message

**Use For:**
- Displaying to users
- Error notifications
- In-app messaging

**Message:** "Daily quota exceeded. Please try again tomorrow or upgrade your plan."

## Error Handling Patterns

### Pattern 1: Quota-Aware Operations

**Strategy:** Check for quota errors and handle gracefully

**Implementation Steps:**
1. Wrap Firestore operations in try-catch
2. Check if error is quota error with isQuotaError()
3. Show user-friendly message with getQuotaErrorMessage()
4. Disable further operations when quota exceeded
5. Log quota errors for monitoring

**Error Handling Flow:**
- Detect quota errors immediately
- Show clear user message
- Set quota exceeded flag in UI
- Prevent further quota-consuming operations
- Allow retry after quota reset

### Pattern 2: Retry with Backoff

**Strategy:** Retry only retryable errors with exponential backoff

**Implementation Steps:**
1. Define max retry attempts (typically 3)
2. Wrap operation in retry loop
3. Check if error is retryable with isRetryableError()
4. Calculate exponential delay: 2^attempt * 1000ms
5. Continue or throw based on retry count

**Retry Rules:**
- Retry retryable errors (resource exhaustion, rate limits)
- Never retry quota errors (will not succeed)
- Use exponential backoff between retries
- Set max retry limit to prevent infinite loops
- Return last error after max retries

### Pattern 3: Error Boundary

**Strategy:** Create React hook for error handling

**State Management:**
- Track quota exceeded status
- Track current error
- Provide execute function for operations

**Error Handling Logic:**
1. Check if error is quota error
2. Set quota exceeded flag if true
3. Check if error is retryable
4. Retry operation once if retryable
5. Set error state for other errors

**Hook Return Values:**
- execute function for operations
- quotaExceeded boolean flag
- error object with details

## Common Mistakes to Avoid

1. ❌ Retrying quota errors
   - ✅ Quota errors will not succeed on retry

2. ❌ Showing raw error messages
   - ✅ Use getQuotaErrorMessage() for user-friendly text

3. ❌ No retry limit for retryable errors
   - ✅ Always implement max retry limit (3-5)

4. ❌ Ignoring error types
   - ✅ Check error type before handling

5. ❌ Blocking UI for retryable errors
   - ✅ Retry in background, show loading indicator

## AI Agent Instructions

### When Handling Firestore Errors

1. Always check error type before handling
2. Use isQuotaError() for quota detection
3. Use isRetryableError() for retry logic
4. Implement proper handling for each type
5. Provide user feedback for quota errors

### When Implementing Retry Logic

1. Only retry if isRetryableError() returns true
2. Implement exponential backoff (2^n * 1000ms)
3. Set max retry limit (3-5 retries)
4. Don't retry quota errors
5. Log retry attempts for monitoring

### For User Experience

1. Show clear messages for quota errors
2. Provide action buttons (upgrade, contact)
3. Use loading states for retryable errors
4. Don't block UI for transient errors
5. Track quota state globally

## Code Quality Standards

### TypeScript

- Use unknown type for error parameter
- Type guard functions properly
- Narrow error type before accessing properties
- Export for use across modules

### Error Handling

- Always handle quota errors explicitly
- Never swallow errors silently
- Log errors appropriately
- Provide context in logs

## Performance Considerations

### Retry Strategy

- Exponential backoff prevents hammering service
- Max retries prevent infinite loops
- Short delays for user-facing operations
- Longer delays for background operations

### Quota Monitoring

- Track quota usage proactively
- Show warnings before hitting limit
- Implement graceful degradation
- Cache data to reduce quota usage

## Related Documentation

- [Firestore Module README](../README.md)
- [Firestore Error Codes](https://firebase.google.com/docs/firestore/manage-rest/errors)
- [Quota Management](../../infrastructure/services/quota-tracker-service/README.md)

## Firebase Quota Best Practices

### Quota Types

**Daily Quota:**
- Reads: 50,000/day (free tier)
- Writes: 20,000/day (free tier)
- Deletes: 20,000/day (free tier)

**Strategies:**
- Monitor usage before hitting limits
- Implement caching to reduce reads
- Batch writes to reduce write count
- Use pagination to limit result size

### Quota Exceeded Handling

1. **Stop operations** - Don't waste quota on failed operations
2. **Inform user** - Clear message about what happened
3. **Provide options** - Upgrade plan, wait, contact support
4. **Track state** - Remember quota exceeded across app
5. **Retry later** - Allow retry when quota resets

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
