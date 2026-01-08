# Presentation Layer

Shared presentation layer components and utilities for React Native applications.

## Purpose

Provides reusable UI components, context providers, hooks, and utilities for presenting Firebase data and managing authentication state in React Native applications.

## For AI Agents

### Before Using Presentation Layer

1. **WRAP** app with required providers
2. **USE** provided hooks for state management
3. **PROTECT** authenticated screens
4. **HANDLE** loading and error states
5. **NEVER** create duplicate providers or components

### Required Practices

1. **Use providers** - Wrap app with AuthProvider and UserProvider
2. **Protect screens** - Use ProtectedScreen for authenticated routes
3. **Handle states** - Show loading and error components
4. **Use hooks** - Leverage custom hooks for state management
5. **Follow patterns** - Use established presentation patterns

### Forbidden Practices

## ❌ NEVER

- Create duplicate context providers
- Skip wrapping app with providers
- Manually check auth in every component
- Ignore loading and error states
- Create duplicate UI components

## ⚠️ Avoid

- Provider nesting in wrong order
- Missing ProtectedScreen wrapper
- Inline state management
- Not handling error states
- Skipping loading indicators

## Context Providers

### AuthProvider

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Component:** `<AuthProvider>`

**Purpose:** Provides authentication context to entire application

**Props:**
- `children: ReactNode` - Child components

**Context Value:**
- `user: User | null` - Current authenticated user
- `isAuthenticated: boolean` - Authentication status
- `isLoading: boolean` - Loading state
- `error: Error | null` - Authentication error

**Usage Strategy:**
1. Wrap app with AuthProvider at root
2. Access context with useAuthContext hook
3. Check authentication status before routes
4. Handle loading states
5. Display error messages

**When to Use:**
- App initialization (root component)
- Authentication checks
- Protected routes
- User data access
- Auth state management

**Provider Placement:**
- Wrap at highest level (root of app)
- Place inside NavigationContainer if using React Navigation
- Ensure all authenticated screens are children

### UserProvider

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Component:** `<UserProvider>`

**Purpose:** Provides user data context to entire application

**Props:**
- `children: ReactNode` - Child components

**Context Value:**
- `user: UserData | null` - User profile data
- `loading: boolean` - Data loading state
- `error: Error | null` - Data fetch error
- `refresh: () => Promise<void>` - Refresh user data

**Usage Strategy:**
1. Wrap app with UserProvider (inside AuthProvider)
2. Access context with useUserContext hook
3. Fetch user data on authentication
4. Handle loading and error states
5. Refresh data when needed

**When to Use:**
- App initialization (after AuthProvider)
- User profile display
- User data updates
- User-dependent features

**Provider Placement:**
- Wrap inside AuthProvider
- Ensure authenticated before fetching user data
- Place before navigation/screen components

## UI Components

### ProtectedScreen

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Component:** `<ProtectedScreen>`

**Purpose:** HOC component that protects screens requiring authentication

**Props:**
- `children: ReactNode` - Child components to protect

**Usage Strategy:**
1. Wrap authenticated screens with ProtectedScreen
2. Component redirects to login if not authenticated
3. Shows loading while checking auth
4. Auto-handles authentication checks
5. No manual auth checks needed

**When to Use:**
- Dashboard screens
- Profile screens
- Settings screens
- Any authenticated route
- Data-sensitive screens

**Behavior:**
- Shows loading while checking auth
- Redirects to login if not authenticated
- Renders children if authenticated
- Handles auth state changes

### LoadingScreen

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Component:** `<LoadingScreen>`

**Purpose:** Reusable loading screen component

**Props:**
- `message?: string` - Optional loading message

**Usage Strategy:**
1. Show during async operations
2. Provide context with message
3. Use consistent loading UI
4. Replace with content when ready
5. Handle all loading states

**When to Use:**
- Data fetching
- Authentication checks
- Form submissions
- Page transitions
- Any async operation

### ErrorScreen

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Component:** `<ErrorScreen>`

**Purpose:** Reusable error screen component

**Props:**
- `error: Error` - Error to display
- `onRetry?: () => void` - Optional retry callback

**Usage Strategy:**
1. Show when errors occur
2. Display user-friendly error message
3. Provide retry option when possible
4. Log error for debugging
5. Allow error recovery

**When to Use:**
- Data fetch failures
- Authentication errors
- Network errors
- Validation errors
- Any operation failure

## Hooks

### useAuthContext

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Hook:** `useAuthContext()`

**Returns:** `AuthContextValue`

**Purpose:** Access authentication context

**Return Value:**
- `user: User | null` - Current user
- `isAuthenticated: boolean` - Auth status
- `isLoading: boolean` - Loading state
- `error: Error | null` - Auth error

**Usage Strategy:**
1. Call in components that need auth
2. Check isAuthenticated before showing protected content
3. Show loading while isLoading
4. Handle errors appropriately
5. Redirect if not authenticated

**When to Use:**
- Authentication checks
- User data access
- Protected route logic
- Conditional rendering
- Auth-dependent features

### useUserContext

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Hook:** `useUserContext()`

**Returns:** `UserContextValue`

**Purpose:** Access user data context

**Return Value:**
- `user: UserData | null` - User profile data
- `loading: boolean` - Loading state
- `error: Error | null` - Data error
- `refresh: () => Promise<void>` - Refresh function

**Usage Strategy:**
1. Call in components that need user data
2. Show loading while loading
3. Handle errors appropriately
4. Use refresh to update data
5. Display user information

**When to Use:**
- User profile display
- User settings
- User-dependent features
- User updates
- Profile completion

### useLoadingState

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Hook:** `useLoadingState()`

**Returns:** `{isLoading, startLoading, stopLoading}`

**Purpose:** Manage loading state

**Return Value:**
- `isLoading: boolean` - Loading status
- `startLoading: () => void` - Start loading
- `stopLoading: () => void` - Stop loading

**Usage Strategy:**
1. Call hook in component
2. Call startLoading before async operation
3. Call stopLoading after operation completes
4. Use isLoading for conditional rendering
5. Handle in finally block

**When to Use:**
- Data fetching
- Form submissions
- Async operations
- Button loading states
- Content loading

### useErrorState

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**Hook:** `useErrorState()`

**Returns:** `{error, setError, clearError}`

**Purpose:** Manage error state

**Return Value:**
- `error: Error | null` - Current error
- `setError: (error) => void` - Set error
- `clearError: () => void` - Clear error

**Usage Strategy:**
1. Call hook in component
2. Set error when operation fails
3. Display error to user
4. Clear error on retry or dismiss
5. Auto-clear with setTimeout if needed

**When to Use:**
- Error display
- Error recovery
- Form validation
- API failures
- User feedback

## HOC Utilities

### withAuthProtection

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**HOC:** `withAuthProtection(Component)`

**Purpose:** Higher-order component to protect components

**Parameters:**
- `Component: ReactComponentType` - Component to protect

**Returns:** Protected component

**Usage Strategy:**
1. Wrap component export with HOC
2. Component auto-checks authentication
3. Redirects if not authenticated
4. No manual auth checks needed
5. Use for entire screens

**When to Use:**
- Screen-level protection
- Export-time protection
- Alternative to ProtectedScreen wrapper
- Route protection

### withLoading

**Import From:** `@umituz/react-native-firebase/presentation` or `src/presentation`

**HOC:** `withLoading(Component, options)`

**Purpose:** Higher-order component to add loading state

**Parameters:**
- `Component: ReactComponentType` - Component to wrap
- `options: { loadingComponent, checkLoading }` - Configuration

**Returns:** Component with loading state

**Usage Strategy:**
1. Wrap component that needs loading
2. Provide custom loading component
3. Define checkLoading function
4. HOC auto-shows loading
5. Use for consistent loading UI

**When to Use:**
- Consistent loading patterns
- Reusable loading logic
- Component-level loading
- Conditional loading display

## App Structure

### Provider Setup Order

**Correct Order:**
1. Initialize Firebase
2. Wrap with AuthProvider
3. Wrap with UserProvider (inside AuthProvider)
4. Wrap with NavigationContainer (if using React Navigation)
5. Render app screens

**Provider Nesting:**
- AuthProvider (outermost)
- UserProvider (inside AuthProvider)
- NavigationContainer (inside UserProvider)
- Screens (inside NavigationContainer)

### Screen Protection Strategy

**Authentication Flow:**
1. App starts
2. Providers initialize
3. Check authentication status
4. Show loading while checking
5. Redirect to login or dashboard
6. Handle auth state changes

**Protected Screen:**
1. User navigates to protected route
2. ProtectedScreen checks authentication
3. Redirect to login if not authenticated
4. Show content if authenticated

## Common Mistakes to Avoid

1. ❌ Not wrapping app with providers
   - ✅ Always wrap with AuthProvider and UserProvider

2. ❌ Wrong provider order
   - ✅ AuthProvider → UserProvider → Navigation

3. ❌ Not handling loading states
   - ✅ Show loading indicators during async operations

4. ❌ Ignoring error states
   - ✅ Display errors and provide retry options

5. ❌ Manual auth checks in every component
   - ✅ Use ProtectedScreen or withAuthProtection

## AI Agent Instructions

### When Setting Up App

1. Initialize Firebase first
2. Wrap app with AuthProvider
3. Wrap with UserProvider inside AuthProvider
4. Set up navigation
5. Test provider hierarchy

### When Creating Screen

1. Check if authentication required
2. Use ProtectedScreen if needed
3. Handle loading state
4. Handle error state
5. Provide user feedback

### When Using Hooks

1. Call hooks at component top level
2. Destructure return values
3. Check states before rendering
4. Handle loading and errors
5. Update state appropriately

### When Showing Loading

1. Use LoadingScreen component
2. Provide context message
3. Show during async operations
4. Replace with content when ready
5. Handle all loading scenarios

## Code Quality Standards

### Provider Setup

- Wrap app at root level
- Follow correct order
- Nest providers properly
- Initialize before usage
- Handle provider errors

### Screen Protection

- Use ProtectedScreen consistently
- Handle all auth states
- Show loading during checks
- Redirect appropriately
- Provide user feedback

### State Management

- Use provided hooks
- Handle loading states
- Handle error states
- Update state correctly
- Provide user feedback

## Performance Considerations

### Provider Performance

- Minimize provider re-renders
- Memoize context values when needed
- Split providers if needed
- Avoid deep nesting
- Optimize context updates

### Component Performance

- Use React.memo for expensive components
- Avoid unnecessary re-renders
- Optimize hook dependencies
- Lazy load screens
- Code split when appropriate

## Related Documentation

- [Auth Infrastructure README](../auth/infrastructure/README.md)
- [Firestore Infrastructure README](../firestore/infrastructure/README.md)
- [Storage Infrastructure README](../storage/README.md)
- [Infrastructure README](../infrastructure/README.md)

## API Reference

### Providers

**Import Path:** `@umituz/react-native-firebase/presentation` or `src/presentation`

| Component | Props | Description |
|-----------|-------|-------------|
| `AuthProvider` | `children` | Provides auth context |
| `UserProvider` | `children` | Provides user context |

### Components

**Import Path:** `@umituz/react-native-firebase/presentation` or `src/presentation`

| Component | Props | Description |
|-----------|-------|-------------|
| `ProtectedScreen` | `children` | Protects authenticated screens |
| `LoadingScreen` | `message?` | Displays loading state |
| `ErrorScreen` | `error, onRetry?` | Displays error state |

### Hooks

**Import Path:** `@umituz/react-native-firebase/presentation` or `src/presentation`

| Hook | Returns | Description |
|------|---------|-------------|
| `useAuthContext()` | `AuthContextValue` | Access auth context |
| `useUserContext()` | `UserContextValue` | Access user context |
| `useLoadingState()` | `{isLoading, startLoading, stopLoading}` | Manage loading state |
| `useErrorState()` | `{error, setError, clearError}` | Manage error state |

### HOCs

**Import Path:** `@umituz/react-native-firebase/presentation` or `src/presentation`

| HOC | Parameters | Description |
|-----|------------|-------------|
| `withAuthProtection` | `Component` | Protect component requiring auth |
| `withLoading` | `Component, options` | Add loading state to component |

---

**Last Updated:** 2025-01-08
**Maintainer:** Presentation Layer Team
