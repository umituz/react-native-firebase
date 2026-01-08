# Auth Configuration

Firebase Authentication client initialization, configuration management, and service access.

## Purpose

Provides core Firebase Auth client functionality including initialization, state management, service access, error handling, and client reset.

## For AI Agents

### Before Using Auth Config

1. **INITIALIZE** Auth once at app startup
2. **CHECK** initialization status before use
3. **USE** getFirebaseAuth() to get Auth instance
4. **HANDLE** initialization errors appropriately
5. **NEVER** initialize Auth multiple times

### Required Practices

1. **Initialize once** - Call initializeFirebaseAuth() at app startup
2. **Check status** - Verify initialization before using Auth
3. **Get Auth instance** - Use getFirebaseAuth() after initialization
4. **Handle errors** - Check for initialization errors
5. **Use services** - Use auth services instead of direct Auth SDK

### Forbidden Practices

## ❌ NEVER

- Initialize Firebase Auth multiple times
- Use Auth SDK before initialization
- Use getAuth() from firebase/auth directly
- Ignore initialization errors
- Skip initialization status check

## ⚠️ Avoid

- Initializing Auth in components
- Not checking initialization status
- Direct Firebase Auth SDK usage
- Initializing without Firebase app
- Not handling initialization failures

## Initialization Strategy

### Basic Initialization

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/config`

**Function:** `initializeFirebaseAuth()`

**Returns:** `Promise<void>`

**When to Use:**
- App startup (after Firebase initialized)
- Before any auth operations
- Root component initialization

**Initialization Flow:**
1. Verify Firebase app initialized
2. Get Firebase app instance
3. Initialize Auth with app
4. Set initialization state
5. Handle errors appropriately

### Check Initialization Status

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/config`

**Functions:**
- `isFirebaseAuthInitialized()` - Check if Auth initialized
- `isFirebaseAuthInitializing()` - Check if initializing
- `getFirebaseAuthInitializationError()` - Get error if failed

**Returns:**
- `boolean` for status checks
- `Error | null` for error check

**When to Use:**
- Before auth operations
- Before using auth services
- Error recovery
- Status display

**Usage Strategy:**
1. Check isFirebaseAuthInitialized()
2. If false, show loading or initialize
3. If error, show error message
4. Proceed with auth operations

## Service Access

### Get Auth Instance

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/config`

**Function:** `getFirebaseAuth()`

**Returns:** `Auth` instance from Firebase Auth SDK

**Usage Strategy:**
1. Check initialization status first
2. Call getFirebaseAuth()
3. Use Auth instance for operations
4. Handle errors appropriately

**When to Use:**
- Custom auth operations
- Direct Auth SDK usage (rare)
- Advanced auth features
- Auth service implementations

**Important:** Prefer using auth services over direct Auth SDK usage

### Reset Client

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/config`

**Function:** `resetFirebaseAuthClient()`

**Purpose:** Reset Auth client state (useful for testing)

**When to Use:**
- Testing scenarios
- Error recovery
- Reinitialization
- Development

**Usage Strategy:**
1. Call resetFirebaseAuthClient()
2. Reinitialize if needed
3. Use only in development/testing
4. Never use in production

## Common Mistakes to Avoid

1. ❌ Initializing Auth multiple times
   - ✅ Initialize once at app startup

2. ❌ Not checking initialization status
   - ✅ Always check isFirebaseAuthInitialized()

3. ❌ Using getAuth() from firebase/auth
   - ✅ Use getFirebaseAuth() from auth config

4. ❌ Initializing before Firebase app
   - ✅ Initialize Firebase first, then Auth

5. ❌ Ignoring initialization errors
   - ✅ Handle and display errors

## AI Agent Instructions

### When Initializing Auth

1. Initialize Firebase first
2. Call initializeFirebaseAuth()
3. Await initialization completion
4. Check for errors
5. Show error message if failed

### When Using Auth Services

1. Check Auth initialization status
2. If not initialized, initialize first
3. Use auth services (not direct SDK)
4. Handle errors appropriately
5. Show user feedback

### When Getting Auth Instance

1. Check isFirebaseAuthInitialized()
2. Call getFirebaseAuth()
3. Use Auth instance
4. Handle uninitialized state
5. Prefer auth services over direct usage

## Code Quality Standards

### Initialization

- Initialize once at startup
- Check status before use
- Handle errors gracefully
- Show loading states
- Provide error feedback

### Error Handling

- Catch initialization errors
- Store error in state
- Provide error context
- Allow retry/recovery
- Log for debugging

## Performance Considerations

### Initialization Overhead

- One-time cost at app startup
- Async initialization (non-blocking)
- ~50-200ms typical
- Initialize once, reuse Auth instance
- Don't reinitialize unnecessarily

### State Checking

- Fast boolean checks
- No performance overhead
- Safe to call frequently
- Use before auth operations
- Prevents errors

## Related Documentation

- [Auth Module README](../../README.md)
- [Auth Services README](../services/README.md)
- [Firebase Infrastructure Config README](../../../infrastructure/config/README.md)

## API Reference

### Main Functions

**Import Path:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/config`

| Function | Returns | Description |
|----------|---------|-------------|
| `initializeFirebaseAuth` | `Promise<void>` | Initialize Firebase Auth |
| `getFirebaseAuth` | `Auth` | Get Auth instance |
| `isFirebaseAuthInitialized` | `boolean` | Check if initialized |
| `isFirebaseAuthInitializing` | `boolean` | Check if initializing |
| `getFirebaseAuthInitializationError` | `Error \| null` | Get initialization error |
| `resetFirebaseAuthClient` | `void` | Reset client state (testing) |

---

**Last Updated:** 2025-01-08
**Maintainer:** Auth Module Team
