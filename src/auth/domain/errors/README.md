# Auth Errors

Firebase Authentication error types and error handling utilities.

## Purpose

Provides custom error classes for Firebase Authentication operations with structured error handling, type safety, and user-friendly error messages.

## For AI Agents

### Before Using Auth Errors

1. **USE** custom error classes (not raw Firebase errors)
2. **CHECK** error types with instanceof
3. **PROVIDE** user-friendly error messages
4. **HANDLE** retryable errors appropriately
5. **LOG** errors for debugging

### Required Practices

1. **Use custom error classes** - Import from auth module
2. **Check error types** - Use instanceof for type checking
3. **Map error codes** - Convert to user-friendly messages
4. **Handle retryable errors** - Implement retry logic
5. **Log errors** - Include context for debugging

### Forbidden Practices

## ❌ NEVER

- Throw primitive values (always Error instances)
- Show technical error messages to users
- Ignore error codes
- Assume all errors are fatal
- Catch and suppress errors silently

## ⚠️ Avoid

- Generic error handling
- Not checking error types
- Not providing user feedback
- Missing error context
- Not logging auth errors

## Error Classes

### FirebaseAuthError

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

**Purpose:** Base error class for all Firebase Auth errors

**Properties:**
- `code: string` - Error code for programmatic handling
- `message: string` - Human-readable error message

**Usage:**
- Base class for all auth errors
- Type checking with instanceof
- Error code for conditional logic

**When to Use:**
- Throwing custom auth errors
- Catching and handling auth errors
- Type-safe error handling

### FirebaseAuthInitializationError

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

**Purpose:** Error thrown when Firebase Auth fails to initialize

**Extends:** FirebaseAuthError

**Usage:**
- Initialization failures
- Configuration errors
- Firebase setup issues

**When to Use:**
- Auth not initialized
- Invalid Firebase config
- Initialization timeout

## Error Handling Strategies

### For Auth Operation Errors

**Strategy:** Catch and handle auth errors with user-friendly messages.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

**When to Use:**
- Sign-in failures
- Sign-up failures
- Password reset failures
- Email verification failures

**Handling Strategy:**
1. Wrap auth operation in try-catch
2. Check error type with instanceof
3. Map error code to user message
4. Display error to user
5. Provide retry option if appropriate
6. Log technical error for debugging

### For Initialization Errors

**Strategy:** Handle Firebase Auth initialization failures.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

**When to Use:**
- App startup
- Auth service initialization
- Configuration loading

**Handling Strategy:**
1. Catch initialization error
2. Check if FirebaseAuthInitializationError
3. Show setup error message
4. Provide setup instructions
5. Offer retry option

### For Network Errors

**Strategy:** Retry transient network failures.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

**When to Use:**
- Network connection failed
- Request timeout
- Service unavailable

**Handling Strategy:**
1. Check error code for network issues
2. Show network error message
3. Provide retry button
4. Implement retry with delay
5. Limit retry attempts

### For User-Facing Messages

**Strategy:** Map error codes to user-friendly messages.

**Import From:** Use error.code to map messages

**Common Error Messages:**
- `INVALID_CREDENTIALS` → "Invalid email or password"
- `USER_NOT_FOUND` → "Account not found"
- `WEAK_PASSWORD` → "Password is too weak"
- `EMAIL_ALREADY_IN_USE` → "Email already registered"
- `NETWORK_ERROR` → "Network error. Please check your connection"
- `TOO_MANY_REQUESTS` → "Too many attempts. Please try again later"

**Implementation:**
1. Create error message mapper
2. Map error codes to messages
3. Display message to user
4. Provide action buttons
5. Handle retry scenarios

## Error Codes Reference

### Common Error Codes

**Import From:** Error.code property

| Error Code | Description | Retryable | User Message |
|------------|-------------|-----------|--------------|
| `INVALID_CREDENTIALS` | Invalid email or password | No | Invalid email or password |
| `USER_NOT_FOUND` | User account not found | No | Account not found |
| `WEAK_PASSWORD` | Password too weak | No | Password is too weak |
| `EMAIL_ALREADY_IN_USE` | Email already registered | No | Email already registered |
| `NETWORK_ERROR` | Network connection failed | Yes | Network error. Check connection |
| `TIMEOUT` | Request timeout | Yes | Request timeout. Try again |
| `TOO_MANY_REQUESTS` | Rate limit exceeded | Yes | Too many attempts. Wait |
| `USER_DISABLED` | User account disabled | No | Account disabled |
| `INVALID_EMAIL` | Invalid email format | No | Invalid email format |
| `EMAIL_NOT_VERIFIED` | Email not verified | No | Please verify your email |

## Common Mistakes to Avoid

1. ❌ Not checking error types
   - ✅ Use instanceof for type checking

2. ❌ Showing technical messages to users
   - ✅ Map error codes to user-friendly messages

3. ❌ Not providing retry options
   - ✅ Offer retry for retryable errors

4. ❌ Not logging errors
   - ✅ Log errors with context

5. ❌ Generic error handling
   - ✅ Handle specific error types

## AI Agent Instructions

### When Handling Auth Errors

1. Wrap auth operations in try-catch
2. Check error type with instanceof
3. Map error code to user message
4. Display user-friendly message
5. Provide retry option if appropriate
6. Log technical error for debugging

### When Creating Error Messages

1. Map error codes to messages
2. Use clear, non-technical language
3. Provide actionable next steps
4. Keep messages concise
5. Localize if needed

### When Implementing Retry Logic

1. Check if error is retryable
2. Show retry button to user
3. Implement retry with delay
4. Limit retry attempts
5. Show countdown if rate limited

## Code Quality Standards

### Error Handling

- Always use custom error classes
- Check error types before handling
- Provide user-friendly messages
- Log errors with context
- Handle specific error types

### Type Safety

- Use instanceof for type checking
- Never use `any` for errors
- Type all error parameters
- Export error classes
- Use discriminated unions

### User Experience

- Show clear error messages
- Provide actionable next steps
- Offer retry when appropriate
- Don't show technical details
- Test error flows

## Performance Considerations

### Error Logging

- Log errors asynchronously
- Don't block on logging
- Include context (operation, userId)
- Sanitize sensitive data
- Use error tracking service

### Retry Logic

- Limit retry attempts
- Use exponential backoff
- Show retry progress
- Don't retry non-retryable errors
- Consider rate limiting

## Related Documentation

- [Auth Module README](../../README.md)
- [Auth Services README](../infrastructure/services/README.md)
- [Auth Stores README](../infrastructure/stores/README.md)

## API Reference

### Error Classes

**Import Path:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

| Class | Constructor Parameters | Description |
|-------|----------------------|-------------|
| `FirebaseAuthError` | `(message: string, code: string)` | Base auth error |
| `FirebaseAuthInitializationError` | `(message: string)` | Init error |

---

**Last Updated:** 2025-01-08
**Maintainer:** Auth Module Team
