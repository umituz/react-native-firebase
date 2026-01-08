# Firebase Infrastructure Configuration

Core Firebase client initialization, configuration management, and service orchestration for the entire package.

## Purpose

Provides foundational Firebase initialization and configuration system used by all modules (Auth, Firestore, Storage), handling app initialization, config loading/validation, service orchestration, state management, and error handling.

## For AI Agents

### Before Using Firebase Config

1. **INITIALIZE** Firebase once at app startup
2. **USE** environment variables for config
3. **VALIDATE** config before initialization
4. **HANDLE** initialization errors appropriately
5. **NEVER** initialize multiple times

### Required Practices

1. **Initialize once** - Call initializeFirebase() at app startup
2. **Use environment variables** - Load config from env, not hardcoded
3. **Validate config** - Check all required fields present
4. **Handle errors** - Show user-friendly error messages
5. **Check initialization** - Verify before using Firebase services

### Forbidden Practices

## ❌ NEVER

- Initialize Firebase multiple times
- Hardcode Firebase config
- Skip config validation
- Ignore initialization errors
- Use Firebase services before initialization

## ⚠️ Avoid

- Initializing Firebase in components
- Not checking initialization status
- Invalid config values
- Missing required config fields
- Initializing synchronously

## Initialization Strategy

### Basic Initialization

**Import From:** `@umituz/react-native-firebase` or `src/infrastructure/config`

**Function:** `initializeFirebase(config?)`

**Parameters:**
- `config?: FirebaseConfig` - Optional config object (uses env if not provided)

**Returns:** `Promise<void>`

**When to Use:**
- App startup (before any Firebase usage)
- Root component initialization
- Before using Auth, Firestore, or Storage

**Initialization Flow:**
1. Load config from env or parameter
2. Validate config fields
3. Initialize Firebase app
4. Initialize services (Auth, Firestore, Storage)
5. Set initialization state

### Configuration from Environment

**Import From:** `@umituz/react-native-firebase` or `src/infrastructure/config`

**Strategy:** Load config automatically from environment variables

**Required Environment Variables:**
- `EXPO_PUBLIC_FIREBASE_API_KEY` - Firebase API key
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` - Auth domain
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID` - Project ID
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` - Storage bucket
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` - Sender ID
- `EXPO_PUBLIC_FIREBASE_APP_ID` - App ID

**Usage:**
1. Set environment variables in .env file
2. Call `initializeFirebase()` without parameters
3. Config auto-loaded from environment
4. Services initialized with config

**Benefits:**
- No hardcoded credentials
- Environment-specific configs
- Security (credentials not in code)
- Easy deployment management

### Manual Configuration

**Import From:** `@umituz/react-native-firebase` or `src/infrastructure/config`

**Strategy:** Provide config object directly to initializeFirebase()

**When to Use:**
- Testing without env vars
- Dynamic configuration
- Multi-tenant applications
- Config from external service

**Config Object Properties:**
- `apiKey: string` - Firebase API key
- `authDomain: string` - Auth domain
- `projectId: string` - Project ID
- `storageBucket: string` - Storage bucket
- `messagingSenderId: string` - Sender ID
- `appId: string` - App ID

## State Management

### Initialization State

**Import From:** `@umituz/react-native-firebase` or `src/infrastructure/config`

**Strategy:** Track Firebase initialization state

**State Properties:**
- `isInitialized: boolean` - Firebase initialized
- `isInitializing: boolean` - Initialization in progress
- `error: Error | null` - Initialization error

**Checking Status:**
- `isFirebaseInitialized()` - Check if ready
- `isFirebaseInitializing()` - Check if initializing
- `getFirebaseInitializationError()` - Get error if failed

**When to Check:**
- Before using Firebase services
- Before navigation
- Before app operations
- Error recovery

## Service Access

### Get Firebase App

**Import From:** `@umituz/react-native-firebase` or `src/infrastructure/config`

**Function:** `getFirebaseApp()`

**Returns:** `FirebaseApp` instance

**Usage Strategy:**
1. Check initialization status first
2. Call getFirebaseApp()
3. Use app for service initialization
4. Handle errors appropriately

**When to Use:**
- Custom service initialization
- Direct Firebase SDK usage
- Advanced Firebase features

## Common Mistakes to Avoid

1. ❌ Initializing Firebase multiple times
   - ✅ Initialize once at app startup

2. ❌ Hardcoding config values
   - ✅ Use environment variables

3. ❌ Not checking initialization status
   - ✅ Always check isFirebaseInitialized()

4. ❌ Initializing in components
   - ✅ Initialize in root/app startup

5. ❌ Ignoring initialization errors
   - ✅ Handle and display errors

## AI Agent Instructions

### When Initializing Firebase

1. Call initializeFirebase() at app startup
2. Pass config or use environment variables
3. Await initialization completion
4. Check for errors
5. Show error message if failed

### When Checking Initialization

1. Use isFirebaseInitialized() before Firebase operations
2. Show loading state during initialization
3. Handle initialization errors
4. Provide retry option
5. Log errors for debugging

### When Getting Firebase App

1. Check initialization status first
2. Call getFirebaseApp()
3. Use app for services
4. Handle uninitialized state
5. Test thoroughly

## Code Quality Standards

### Configuration

- Validate all config fields
- Use environment variables
- Document required fields
- Handle missing config
- Provide clear error messages

### Error Handling

- Catch initialization errors
- Store error in state
- Provide error context
- Allow retry
- Log for debugging

## Performance Considerations

### Initialization Overhead

- One-time cost at app startup
- Async initialization (non-blocking)
- ~100-500ms typical
- Initialize once, reuse app instance
- Don't reinitialize unnecessarily

### Config Loading

- Environment variables load fast
- Validation adds minimal overhead
- Cache config after loading
- Don't reload config repeatedly

## Related Documentation

- [Auth Configuration README](../../auth/infrastructure/config/README.md)
- [Firestore Configuration README](../../firestore/infrastructure/config/README.md)
- [Storage Configuration README](../../storage/README.md)

## API Reference

### Main Functions

**Import Path:** `@umituz/react-native-firebase` or `src/infrastructure/config`

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `initializeFirebase` | `config?: FirebaseConfig` | `Promise<void>` | Initialize Firebase |
| `getFirebaseApp` | - | `FirebaseApp` | Get Firebase app instance |
| `isFirebaseInitialized` | - | `boolean` | Check if initialized |
| `isFirebaseInitializing` | - | `boolean` | Check if initializing |
| `getFirebaseInitializationError` | - | `Error \| null` | Get initialization error |

---

**Last Updated:** 2025-01-08
**Maintainer:** Infrastructure Team
