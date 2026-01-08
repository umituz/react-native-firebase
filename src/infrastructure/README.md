# Infrastructure Services

Core infrastructure services providing shared functionality across the application.

## Purpose

Provides infrastructure-level services for state management, error handling, logging, configuration, and utility functions used across all Firebase modules.

## For AI Agents

### Before Using Infrastructure Services

1. **USE** stores for global state management
2. **HANDLE** errors through centralized error handler
3. **LOG** events with appropriate log levels
4. **VALIDATE** configuration before use
5. **NEVER** create duplicate stores or services

### Required Practices

1. **Use Zustand stores** - Leverage provided stores for global state
2. **Centralize error handling** - Use errorHandler for all errors
3. **Log appropriately** - Use correct log levels (debug, info, warn, error)
4. **Validate configuration** - Check config before using services
5. **Use utilities** - Leverage provided utility functions

### Forbidden Practices

## ❌ NEVER

- Create duplicate state stores
- Handle errors inline without errorHandler
- Use console.log directly (use logger instead)
- Skip configuration validation
- Create duplicate utility functions

## ⚠️ Avoid

- Local state for global data
- Silent error swallowing
- Inconsistent log levels
- Hardcoded configuration
- Reinventing existing utilities

## State Management

### Auth Store

**Import From:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

**Hook:** `useAuthStore()`

**Purpose:** Manage authentication state globally

**State Properties:**
- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state
- `error: Error | null` - Authentication error

**Actions:**
- `setUser(user)` - Set current user
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error
- `clearError()` - Clear error
- `logout()` - Logout user

**Usage Strategy:**
1. Import useAuthStore from infrastructure
2. Select only needed state (not entire store)
3. Use for authentication status checks
4. Update state through actions
5. Persist state automatically

**When to Use:**
- Authentication status checks
- User data access
- Global auth state management
- Protected route logic

### User Store

**Import From:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

**Hook:** `useUserStore()`

**Purpose:** Manage user data state globally

**State Properties:**
- `userData: UserData | null` - User profile data
- `loading: boolean` - Data loading state
- `error: Error | null` - Data fetch error

**Actions:**
- `fetchUserData(userId)` - Fetch user from Firestore
- `updateUserData(data)` - Update user data
- `clearUserData()` - Clear user data

**Usage Strategy:**
1. Import useUserStore from infrastructure
2. Select only needed properties
3. Fetch data on mount if needed
4. Handle loading and error states
5. Clear data on logout

**When to Use:**
- User profile management
- User data display
- User updates
- User state synchronization

## Error Handling

### Error Handler

**Import From:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

**Service:** `errorHandler`

**Purpose:** Centralized error handling and reporting

**Method:** `handle(error, options?)`

**Parameters:**
- `error: unknown` - Error to handle
- `options?: { context?, action?, showToast? }`

**Usage Strategy:**
1. Wrap operations in try-catch
2. Call errorHandler.handle() in catch
3. Provide context and action
4. Show toast if needed
5. Error logged and tracked automatically

**When to Use:**
- All error scenarios
- API failures
- Auth errors
- Firestore errors
- Validation errors

**Error Handling Flow:**
1. Normalize error to Error instance
2. Log error with context
3. Notify error listeners
4. Show toast if requested
5. Track error in analytics

## Logging

### Logger

**Import From:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

**Service:** `logger`

**Purpose:** Structured logging with levels

**Methods:**
- `debug(message, context?)` - Debug messages (DEV only)
- `info(message, context?)` - Informational messages
- `warn(message, context?)` - Warning messages
- `error(message, context?)` - Error messages

**Usage Strategy:**
1. Use appropriate log level
2. Include context object with relevant data
3. Debug only in development
4. Info for important events
5. Warn for concerning situations
6. Error for failures

**When to Use:**
- Debug: Development debugging
- Info: User actions, state changes
- Warn: Deprecated usage, unexpected but valid
- Error: Failures, exceptions

**Log Levels:**
- Debug: Detailed development info
- Info: General informational messages
- Warn: Warning conditions
- Error: Error conditions

## Configuration

### Config Manager

**Import From:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

**Service:** `configManager`

**Purpose:** Configuration management and validation

**Methods:**
- `set(key, value)` - Set config value
- `get<T>(key, defaultValue?)` - Get config value
- `getAll()` - Get all config
- `loadFromEnv()` - Load from environment
- `validate(requiredKeys)` - Validate config

**Usage Strategy:**
1. Load config from environment on startup
2. Validate required config keys
3. Access config with get() method
4. Provide default values when possible
5. Handle missing config errors

**When to Use:**
- App initialization
- Environment-specific settings
- Firebase configuration
- Feature flags
- API endpoints

## Utility Functions

### Async Utilities

**Import From:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

**Functions:**
- `retry(fn, maxRetries?, delay?)` - Retry with exponential backoff
- `debounce(fn, delay)` - Debounce function calls
- `throttle(fn, delay)` - Throttle function calls

**Usage Strategy:**
1. Use retry for unreliable operations
2. Use debounce for search/input
3. Use throttle for scroll/resize
4. Configure delay appropriately
5. Handle errors in retry

**When to Use:**
- Retry: API calls, network operations
- Debounce: Search boxes, input validation
- Throttle: Scroll events, resize handlers

### Validation Utilities

**Import From:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

**Functions:**
- `isValidEmail(email)` - Validate email format
- `isValidUrl(url)` - Validate URL format
- `validateRequired(data, requiredFields)` - Validate required fields

**Usage Strategy:**
1. Validate before API calls
2. Check email format on input
3. Validate URLs before navigation
4. Use validateRequired for forms
5. Show validation errors to users

**When to Use:**
- Form validation
- Input validation
- API request validation
- User signup/update

## Common Mistakes to Avoid

1. ❌ Creating duplicate state stores
   - ✅ Use provided infrastructure stores

2. ❌ Handling errors inline
   - ✅ Use centralized errorHandler

3. ❌ Using console.log directly
   - ✅ Use logger with appropriate levels

4. ❌ Hardcoding configuration
   - ✅ Use configManager with environment variables

5. ❌ Reinventing utilities
   - ✅ Use provided utility functions

## AI Agent Instructions

### When Creating State

1. Check if store already exists
2. Use Zustand for global state
3. Provide actions for state updates
4. Select specific properties (not entire store)
5. Persist state if needed

### When Handling Errors

1. Wrap operations in try-catch
2. Use errorHandler.handle()
3. Provide context and action
4. Show user-friendly messages
5. Log errors appropriately

### When Logging

1. Use appropriate log level
2. Include context with relevant data
3. Debug only in development
4. Log important events
5. Don't log sensitive data

### When Validating

1. Validate before operations
2. Use validation utilities
3. Show clear error messages
4. Validate on client and server
5. Handle validation errors

## Code Quality Standards

### State Management

- Use Zustand stores
- Select specific properties
- Update through actions
- Persist when needed
- Handle loading states

### Error Handling

- Centralize error handling
- Provide context
- Show user-friendly messages
- Log all errors
- Track in analytics

### Logging

- Use appropriate levels
- Include context
- Don't log sensitive data
- Debug in development only
- Structure logs consistently

## Performance Considerations

### State Selectors

- Select specific properties (not entire store)
- Avoid unnecessary re-renders
- Use shallow equality when possible
- Batch state updates
- Persist state efficiently

### Error Handling

- Don't swallow errors
- Provide context for debugging
- Track errors asynchronously
- Show user feedback
- Don't block on error tracking

### Logging

- Minimize logging in production
- Use appropriate log levels
- Avoid expensive operations in logs
- Don't log in tight loops
- Structure logs for parsing

## Related Documentation

- [Auth Infrastructure README](../auth/infrastructure/README.md)
- [Firestore Infrastructure README](../firestore/infrastructure/README.md)
- [Storage Infrastructure README](../storage/README.md)
- [Firebase Config README](./config/README.md)

## API Reference

### Stores

**Import Path:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

| Hook | State | Actions |
|------|-------|---------|
| `useAuthStore` | `user, isAuthenticated, isLoading, error` | `setUser, setLoading, setError, clearError, logout` |
| `useUserStore` | `userData, loading, error` | `fetchUserData, updateUserData, clearUserData` |

### Services

**Import Path:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

| Service | Methods | Description |
|---------|---------|-------------|
| `errorHandler` | `handle(error, options?)` | Centralized error handling |
| `logger` | `debug, info, warn, error` | Structured logging |
| `configManager` | `set, get, getAll, loadFromEnv, validate` | Configuration management |

### Utilities

**Import Path:** `@umituz/react-native-firebase/infrastructure` or `src/infrastructure`

| Function | Parameters | Return Type | Description |
|----------|------------|-------------|-------------|
| `retry` | `fn, maxRetries?, delay?` | `Promise<T>` | Retry with backoff |
| `debounce` | `fn, delay` | Function | Debounce function |
| `throttle` | `fn, delay` | Function | Throttle function |
| `isValidEmail` | `email` | `boolean` | Validate email |
| `isValidUrl` | `url` | `boolean` | Validate URL |
| `validateRequired` | `data, fields` | Validation result | Validate required fields |

---

**Last Updated:** 2025-01-08
**Maintainer:** Infrastructure Team
