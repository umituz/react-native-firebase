# Firestore Errors

Firebase Firestore error types, error detection, and error handling utilities.

## Purpose

Provides custom error classes for Firestore operations, quota error detection, error handling utilities, and retry logic for transient failures.

## For AI Agents

### Before Using Firestore Errors

1. **USE** custom error classes (not Firebase errors directly)
2. **CHECK** error types with instanceof
3. **HANDLE** quota errors appropriately
4. **RETRY** transient errors automatically
5. **LOG** errors for debugging

### Required Practices

1. **Use custom error classes** - Import from firestore module
2. **Check error types** - Use instanceof for type checking
3. **Handle quota errors** - Show user-friendly messages
4. **Use retry logic** - Retry transient errors
5. **Provide context** - Include error details in logs

### Forbidden Practices

## ❌ NEVER

- Throw primitive values (always Error instances)
- Ignore error types
- Assume all errors are retryable
- Show technical error messages to users
- Catch and suppress errors silently

## ⚠️ Avoid

- Not checking error types before handling
- Retrying non-retryable errors
- Generic error handling
- Not logging errors
- Missing error context

## Error Classes

### FirebaseFirestoreError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**Purpose:** Base error class for all Firestore errors

**Properties:**
- `code: string` - Error code for programmatic handling
- `message: string` - Human-readable error message

**Usage:**
- Base class for all Firestore errors
- Type checking with instanceof
- Error code for conditional logic

**When to Use:**
- Throwing custom Firestore errors
- Catching and handling Firestore errors
- Type-safe error handling

### FirebaseFirestoreInitializationError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**Purpose:** Error thrown when Firestore fails to initialize

**Extends:** FirebaseFirestoreError

**Usage:**
- Initialization failures
- Configuration errors
- Firebase setup issues

**When to Use:**
- Firestore not initialized
- Invalid Firebase config
- Initialization timeout

### FirebaseFirestoreQuotaError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**Purpose:** Error thrown when Firestore quota is exceeded

**Extends:** FirebaseFirestoreError

**Properties:**
- `quotaType: 'read' | 'write' | 'delete'` - Type of quota exceeded
- `usage: QuotaStatus` - Quota usage details

**Usage:**
- Quota exceeded scenarios
- Usage tracking
- Cost management

**When to Use:**
- Read quota exceeded (daily limit)
- Write quota exceeded (daily limit)
- Delete quota exceeded (monthly limit)

## Error Detection

### isQuotaError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**Purpose:** Check if an error is quota-related

**Returns:** `boolean`

**Usage Strategy:**
1. Catch Firestore errors
2. Call isQuotaError(error)
3. Handle quota errors specifically
4. Show user-friendly quota message
5. Log quota usage for monitoring

**When to Use:**
- Distinguishing quota errors from other errors
- Showing quota-specific UI
- Implementing quota-based throttling

### isRetryableError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**Purpose:** Check if an error is retryable (transient)

**Returns:** `boolean`

**Retryable Errors:**
- Network errors
- Timeout errors
- Service unavailable
- Deadline exceeded
- Aborted operations

**Non-Retryable Errors:**
- Permission denied
- Not found
- Invalid arguments
- Quota exceeded
- Failed precondition

**Usage Strategy:**
1. Catch error from operation
2. Check isRetryableError(error)
3. Retry with exponential backoff if true
4. Show error if false
5. Limit retry attempts

### getQuotaErrorMessage

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**Purpose:** Get user-friendly quota error message

**Returns:** `string`

**Message Format:**
- Shows quota type (read/write/delete)
- Displays usage percentage
- Indicates limit reached
- Suggests next steps

**Usage Strategy:**
1. Check if error is quota error
2. Call getQuotaErrorMessage(error)
3. Display message to user
4. Provide upgrade options
5. Log technical details

## Error Handling Strategies

### For Quota Errors

**Strategy:** Detect and handle quota exceeded scenarios.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**When to Use:**
- Daily read quota exceeded
- Daily write quota exceeded
- Monthly delete quota exceeded

**Handling Strategy:**
1. Catch error from Firestore operation
2. Check isQuotaError(error)
3. Get user-friendly message
4. Display upgrade option
5. Log quota usage for monitoring
6. Implement throttling if needed

**User Experience:**
- Clear message about quota exceeded
- Show usage percentage
- Offer upgrade or wait option
- Provide quota reset time

### For Transient Errors

**Strategy:** Retry transient failures with exponential backoff.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**When to Use:**
- Network failures
- Service unavailable
- Timeout errors
- Temporary issues

**Retry Strategy:**
1. Check isRetryableError(error)
2. Wait with exponential backoff (1s, 2s, 4s)
3. Retry operation
4. Limit retries to 3 attempts
5. Give up after max retries

**Exponential Backoff:**
- First retry: 1000ms (1 second)
- Second retry: 2000ms (2 seconds)
- Third retry: 4000ms (4 seconds)
- Max total wait: ~7 seconds

### For Initialization Errors

**Strategy:** Handle Firestore initialization failures.

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**When to Use:**
- Firebase config missing
- Invalid Firebase config
- Network issues during init
- Permission issues

**Handling Strategy:**
1. Catch initialization error
2. Check error type
3. Show setup error message
4. Provide setup instructions
5. Offer retry option

## Error Codes Reference

### Common Error Codes

**Import From:** Error.code property

| Error Code | Description | Retryable | User Action |
|------------|-------------|-----------|-------------|
| `INITIALIZATION_FAILED` | Failed to initialize Firestore | Yes | Check config, retry |
| `QUOTA_EXCEEDED` | Quota limit exceeded | No | Wait or upgrade plan |
| `NOT_FOUND` | Document not found | No | Check document ID |
| `PERMISSION_DENIED` | Insufficient permissions | No | Check security rules |
| `UNAVAILABLE` | Service unavailable | Yes | Retry after delay |
| `DEADLINE_EXCEEDED` | Request timeout | Yes | Retry after delay |
| `ALREADY_EXISTS` | Document already exists | No | Check before create |
| `INVALID_ARGUMENT` | Invalid argument | No | Fix argument value |
| `FAILED_PRECONDITION` | Failed precondition | No | Fix precondition |
| `ABORTED` | Operation aborted | Yes | Retry operation |

## Common Mistakes to Avoid

1. ❌ Not checking error types
   - ✅ Use instanceof for type checking

2. ❌ Retrying non-retryable errors
   - ✅ Check isRetryableError() first

3. ❌ Showing technical messages to users
   - ✅ Use getQuotaErrorMessage() for user-friendly messages

4. ❌ Not logging errors
   - ✅ Log all errors with context

5. ❌ Suppressing errors silently
   - ✅ Always handle or rethrow errors

## AI Agent Instructions

### When Handling Firestore Errors

1. Wrap operations in try-catch
2. Check error type with instanceof
3. Handle quota errors separately
4. Check if retryable with isRetryableError()
5. Retry with backoff if appropriate
6. Log errors with context
7. Show user-friendly messages

### When Implementing Retry Logic

1. Check isRetryableError(error)
2. Use exponential backoff (2^n seconds)
3. Limit retries to 3 attempts
4. Log retry attempts
5. Give up after max retries
6. Show error to user

### When Handling Quota Errors

1. Check isQuotaError(error)
2. Get user-friendly message
3. Display quota usage
4. Show upgrade option
5. Log quota exceeded event
6. Implement throttling if needed

## Code Quality Standards

### Error Handling

- Always use custom error classes
- Check error types before handling
- Provide error context
- Log errors appropriately
- Show user-friendly messages

### Type Safety

- Use instanceof for type checking
- Never use `any` for errors
- Type all error parameters
- Use discriminated unions
- Export error classes

### Retry Logic

- Use exponential backoff
- Limit retry attempts
- Log retry attempts
- Give up after max retries
- Don't retry non-retryable errors

## Performance Considerations

### Retry Overhead

- Retries add latency (up to 7 seconds)
- Use retries only for transient errors
- Limit retry attempts
- Consider circuit breaker pattern
- Monitor retry success rate

### Error Logging

- Log errors asynchronously
- Don't block on logging
- Use error tracking service
- Include context in logs
- Sanitize sensitive data

## Related Documentation

- [Firestore Module README](../../README.md)
- [Quota Error Detector README](../../utils/quota-error-detector/README.md)
- [Firestore Constants README](../constants/README.md)

## API Reference

### Error Classes

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

| Class | Constructor Parameters | Description |
|-------|----------------------|-------------|
| `FirebaseFirestoreError` | `(message: string, code: string)` | Base Firestore error |
| `FirebaseFirestoreInitializationError` | `(message: string)` | Init error |
| `FirebaseFirestoreQuotaError` | `(quotaType, usage: QuotaStatus)` | Quota exceeded error |

### Detection Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `isQuotaError` | `(error: unknown)` | `boolean` | Check if quota error |
| `isRetryableError` | `(error: unknown)` | `boolean` | Check if retryable |
| `getQuotaErrorMessage` | `(error: FirebaseFirestoreQuotaError)` | `string` | Get user-friendly message |

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
