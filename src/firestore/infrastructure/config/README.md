# Firestore Configuration

Firestore client initialization, configuration management, and service initialization.

## Purpose

Provides core Firestore client functionality including initialization, state management, service access, and error handling.

## For AI Agents

### Before Using Firestore Config

1. **INITIALIZE** Firestore once at app startup
2. **CHECK** initialization status before use
3. **USE** getFirestore() to get Firestore instance
4. **HANDLE** initialization errors appropriately
5. **NEVER** initialize Firestore multiple times

### Required Practices

1. **Initialize once** - Call initializeFirestore() at app startup
2. **Check status** - Verify initialization before using Firestore
3. **Get Firestore instance** - Use getFirestore() after initialization
4. **Handle errors** - Check for initialization errors
5. **Use repositories** - Use repository pattern instead of direct Firestore

### Forbidden Practices

## ❌ NEVER

- Initialize Firestore multiple times
- Use Firestore SDK before initialization
- Use getFirestore() from firebase/firestore directly
- Ignore initialization errors
- Skip initialization status check

## ⚠️ Avoid

- Initializing Firestore in components
- Not checking initialization status
- Direct Firestore SDK usage (use repositories)
- Initializing without Firebase app
- Not handling initialization failures

## Initialization Strategy

### Basic Initialization

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/config`

**Function:** `initializeFirestore()`

**Returns:** `Promise<void>`

**When to Use:**
- App startup (after Firebase initialized)
- Before any Firestore operations
- Root component initialization

**Initialization Flow:**
1. Verify Firebase app initialized
2. Get Firebase app instance
3. Initialize Firestore with app
4. Set initialization state
5. Handle errors appropriately

### Check Initialization Status

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/config`

**Functions:**
- `isFirestoreInitialized()` - Check if Firestore initialized
- `isFirestoreInitializing()` - Check if initializing
- `getFirestoreInitializationError()` - Get error if failed

**Returns:**
- `boolean` for status checks
- `Error | null` for error check

**When to Use:**
- Before Firestore operations
- Before using repositories
- Error recovery
- Status display

**Usage Strategy:**
1. Check isFirestoreInitialized()
2. If false, show loading or initialize
3. If error, show error message
4. Proceed with Firestore operations

## Service Access

### Get Firestore Instance

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/config`

**Function:** `getFirestore()`

**Returns:** `Firestore` instance from Firebase Firestore SDK

**Usage Strategy:**
1. Check initialization status first
2. Call getFirestore()
3. Use Firestore instance for operations
4. Handle errors appropriately

**When to Use:**
- Repository implementations
- Custom Firestore operations
- Direct Firestore SDK usage (rare)
- Advanced Firestore features

**Important:** Prefer using repositories over direct Firestore SDK usage

### Reset Client

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/config`

**Function:** `resetFirestoreClient()`

**Purpose:** Reset Firestore client state (useful for testing)

**When to Use:**
- Testing scenarios
- Error recovery
- Reinitialization
- Development

**Usage Strategy:**
1. Call resetFirestoreClient()
2. Reinitialize if needed
3. Use only in development/testing
4. Never use in production

## Common Mistakes to Avoid

1. ❌ Initializing Firestore multiple times
   - ✅ Initialize once at app startup

2. ❌ Not checking initialization status
   - ✅ Always check isFirestoreInitialized()

3. ❌ Using getFirestore() from firebase/firestore
   - ✅ Use getFirestore() from firestore config

4. ❌ Initializing before Firebase app
   - ✅ Initialize Firebase first, then Firestore

5. ❌ Ignoring initialization errors
   - ✅ Handle and display errors

## AI Agent Instructions

### When Initializing Firestore

1. Initialize Firebase first
2. Call initializeFirestore()
3. Await initialization completion
4. Check for errors
5. Show error message if failed

### When Using Repositories

1. Check Firestore initialization status
2. If not initialized, initialize first
3. Use repositories for all operations
4. Handle errors appropriately
5. Show user feedback

### When Getting Firestore Instance

1. Check isFirestoreInitialized()
2. Call getFirestore()
3. Use Firestore instance
4. Handle uninitialized state
5. Prefer repositories over direct usage

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
- Initialize once, reuse Firestore instance
- Don't reinitialize unnecessarily

### State Checking

- Fast boolean checks
- No performance overhead
- Safe to call frequently
- Use before Firestore operations
- Prevents errors

## Related Documentation

- [Firestore Module README](../../README.md)
- [Firestore Repositories README](../repositories/README.md)
- [Firebase Infrastructure Config README](../../../infrastructure/config/README.md)

## API Reference

### Main Functions

**Import Path:** `@umituz/react-native-firebase/firestore` or `src/firestore/infrastructure/config`

| Function | Returns | Description |
|----------|---------|-------------|
| `initializeFirestore` | `Promise<void>` | Initialize Firestore |
| `getFirestore` | `Firestore` | Get Firestore instance |
| `isFirestoreInitialized` | `boolean` | Check if initialized |
| `isFirestoreInitializing` | `boolean` | Check if initializing |
| `getFirestoreInitializationError` | `Error \| null` | Get initialization error |
| `resetFirestoreClient` | `void` | Reset client state (testing) |

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
