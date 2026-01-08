# Auth Stores

Zustand-based state management for Firebase Authentication.

## Purpose

Provides Zustand stores for managing authentication state, user data, and authentication-related UI state with persistence and type safety.

## For AI Agents

### Before Using Auth Stores

1. **ALWAYS** use stores for auth state (never local state)
2. **SELECT** specific state slices for performance
3. **NEVER** persist transient states (loading, error)
4. **USE** actions to update state (never mutate directly)
5. **CLEAR** state on logout

### Required Practices

1. **Use stores** for global auth state
2. **Select specific slices** - Don't select entire store
3. **Use actions** - Call store actions to update state
4. **Persist essential data only** - user, isAuthenticated
5. **Clear state properly** - Reset state on logout

### Forbidden Practices

## ❌ NEVER

- Use local useState for auth state
- Select entire store (causes unnecessary re-renders)
- Persist loading and error states
- Mutate state directly
- Mix auth state with other state
- Store sensitive data without encryption

## ⚠️ Avoid

- Not using selectors for performance
- Persisting transient states
- Complex derived state in store
- Multiple auth stores
- Not clearing state on logout

## Usage Strategies

### For Auth State in Components

**Strategy:** Use useAuthStore hook with selectors.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**When to Use:**
- Checking authentication status
- Getting current user
- Displaying user information
- Protecting routes

**State Properties:**
- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state
- `error: Error | null` - Error state

**Basic Usage:**
1. Import useAuthStore
2. Destructure needed properties
3. Check isAuthenticated before showing protected content
4. Show loading indicator during auth check

### For Performance Optimization

**Strategy:** Select specific state slices only.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**When to Use:**
- Only need user property
- Only need authentication status
- Preventing unnecessary re-renders
- Large components

**Selector Usage:**
- Select single property: `useAuthStore(state => state.user)`
- Select multiple: `useAuthStore(state => ({ user: state.user, isLoading: state.isLoading }))`
- Never select entire store: `const store = useAuthStore()` (bad practice)

**Benefits:**
- Only re-render when selected properties change
- Better performance
- More predictable behavior
- Cleaner code

### For Auth Provider

**Strategy:** Initialize auth state on app startup.

**Import From:** `@umituz/react-native-firebase/auth` and Firebase Auth

**When to Use:**
- App initialization
- Root component
- Auth state sync

**Implementation Strategy:**
1. Create AuthProvider component
2. Use onAuthStateChanged listener
3. Update store with setUser and setLoading
4. Unsubscribe listener on unmount
5. Wrap app root with provider

**Provider Responsibilities:**
- Sync Firebase Auth state with store
- Set loading state during initial check
- Clean up listeners on unmount
- Handle auth state changes

### For Protected Routes

**Strategy:** Check auth state before rendering protected content.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**When to Use:**
- Pages requiring authentication
- User profile pages
- Dashboard and settings
- Protected features

**Route Protection Flow:**
1. Component mounts
2. Check isLoading state
3. If loading, show spinner
4. If authenticated, show protected content
5. If not authenticated, redirect to login
6. Handle anonymous users appropriately

### For Logout

**Strategy:** Use store logout action to sign out user.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**When to Use:**
- User clicks logout button
- Session timeout
- Manual sign-out

**Logout Flow:**
1. Call logout() action from store
2. Sign out from Firebase Auth
3. Clear all auth state
4. Navigation handled by auth state change

### For Error Display

**Strategy:** Show error messages from store state.

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**When to Use:**
- Displaying auth errors
- Showing error banners
- Error toasts/messages

**Error Display Strategy:**
1. Select error from store
2. Show error banner if error exists
3. Call clearError() after displaying
4. Use useEffect for auto-clear

## Store API

### State Properties

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**Properties:**
- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - User logged in status
- `isLoading: boolean` - Auth state loading
- `error: Error | null` - Auth error

**Persistence:**
- Persisted: user, isAuthenticated
- Not persisted: isLoading, error

### Actions

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**Available Actions:**
- `setUser(user: User | null)` - Set current user
- `setLoading(loading: boolean)` - Set loading state
- `setError(error: Error | null)` - Set error
- `clearError()` - Clear error
- `logout()` - Sign out user

**Usage:**
- Call actions to update state
- Never mutate state directly
- Actions handle Firebase operations
- Use logout() for sign-out

## Persistence Strategy

### Persist Configuration

**Import From:** Zustand persist middleware

**Strategy:** Persist only essential auth data.

**Persisted State:**
- `user` - User object
- `isAuthenticated` - Auth status

**Not Persisted:**
- `isLoading` - Transient loading state
- `error` - Transient error state

**Benefits:**
- Faster app startup (user already loaded)
- Better UX (no loading flash)
- Clean state after reload
- No stale transient states

**Storage Name:** 'auth-storage'

## Common Mistakes to Avoid

1. ❌ Using useState for auth state
   - ✅ Always use useAuthStore

2. ❌ Selecting entire store
   - ✅ Select specific properties with selectors

3. ❌ Persisting loading/error states
   - ✅ Only persist user and isAuthenticated

4. ❌ Not clearing errors
   - ✅ Call clearError() after displaying

5. ❌ Mutating state directly
   - ✅ Use store actions

6. ❌ Not using selectors for performance
   - ✅ Always select specific slices

## AI Agent Instructions

### When Using Auth Store in Component

1. Import useAuthStore from auth
2. Select specific properties needed
3. Check isAuthenticated before showing content
4. Show loading state during auth check
5. Handle errors appropriately

### When Creating Auth Provider

1. Use onAuthStateChanged listener
2. Update store on auth changes
3. Set loading state appropriately
4. Clean up listener on unmount
5. Wrap app root with provider

### When Protecting Route

1. Select isAuthenticated and isLoading
2. Show loading while checking
3. Redirect to login if not authenticated
4. Show protected content if authenticated
5. Handle anonymous users appropriately

### When Implementing Logout

1. Call logout() action from store
2. Handle Firebase sign-out
3. Clear all auth state
4. Navigate to login screen
5. Handle errors gracefully

## Code Quality Standards

### TypeScript

- Export AuthState interface
- Type all store properties
- Type all actions
- Use proper User type from Firebase
- Never use `any`

### Performance

- Always use selectors
- Never select entire store
- Select only what's needed
- Use shallow comparison for objects
- Optimize re-renders

### State Management

- One source of truth (store)
- Actions for state updates
- No direct mutations
- Clear state on logout
- Persist only essential data

## Performance Considerations

### Selector Performance

**Why Selectors:**
- Prevents unnecessary re-renders
- Component only updates when selected properties change
- Better performance for large components
- More predictable behavior

**Selector Patterns:**
- Single property: `state => state.user`
- Multiple properties: `state => ({ user, isLoading })`
- Computed: `state => state.user?.email`

### Re-render Optimization

**Selector Strategy:**

**Good Practice:** Select specific state properties
- Use: `useAuthStore(state => state.user)`
- Only re-renders when user changes
- Minimizes re-renders

**Bad Practice:** Select entire store
- Avoid: `useAuthStore()` without selector
- Re-renders on any state change
- Causes unnecessary re-renders

**Selector Usage Rules:**
- Use selectors to extract specific state
- Only re-renders when selected state changes
- Avoid grabbing entire store
- Use shallow equality for objects

## Related Documentation

- [Auth Module README](../../README.md)
- [Auth Services README](../services/README.md)
- [Auth Hooks README](../../presentation/hooks/README.md)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)

## Architecture

### Store Layer (Infrastructure)

**Responsibilities:**
- Global auth state
- State persistence
- State updates via actions
- Auth state sync with Firebase

**Dependencies:**
- Zustand for state management
- Zustand persist middleware
- Firebase Auth SDK (in actions)

**Usage Pattern:**
- UI components use hooks
- Hooks call store actions
- Actions update state
- State persists across sessions

## API Reference

### Main Hook

**Import Path:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/stores`

**Hook:** `useAuthStore(selector?)`

**Returns:**
- Full store state (if no selector)
- Selected state slice (if selector provided)

### State Properties

| Property | Type | Persisted | Description |
|----------|------|-----------|-------------|
| `user` | `User \| null` | Yes | Current authenticated user |
| `isAuthenticated` | `boolean` | Yes | Authentication status |
| `isLoading` | `boolean` | No | Loading state |
| `error` | `Error \| null` | No | Error state |

### Actions

| Action | Parameters | Description |
|--------|------------|-------------|
| `setUser` | `(user: User \| null)` | Set current user |
| `setLoading` | `(loading: boolean)` | Set loading state |
| `setError` | `(error: Error \| null)` | Set error |
| `clearError` | `()` | Clear error |
| `logout` | `()` | Sign out user |

---

**Last Updated:** 2025-01-08
**Maintainer:** Auth Module Team
