# Auth Hooks

React hooks for Firebase Authentication operations with state management and error handling.

## Purpose

Provides React hooks for authentication operations (Anonymous, Google, Apple, Email) with automatic state management, error handling, and loading states.

## For AI Agents

### Before Using Auth Hooks

1. **ALWAYS** use hooks for auth state in UI components
2. **NEVER** use Firebase Auth SDK directly in components
3. **HANDLE** loading, error, and authentication states
4. **PROVIDE** user feedback for auth operations
5. **CLEAN UP** auth listeners on unmount

### Required Practices

1. **Use hooks** for all auth operations in UI
2. **Handle loading states** - show indicators during auth operations
3. **Handle errors** - display user-friendly error messages
4. **Check isAuthenticated** before accessing protected features
5. **Use auth guards** for protected routes

### Forbidden Practices

## ❌ NEVER

- Use Firebase Auth SDK directly in UI components
- Access Firebase functions without hooks
- Ignore loading states
- Ignore auth errors
- Mix auth providers incorrectly
- Hardcode auth credentials

## ⚠️ Avoid

- Not handling loading states (poor UX)
- Not showing error messages to users
- Multiple simultaneous auth operations
- Not cleaning up listeners
- Complicated auth logic in components

## Usage Strategies

### For General Authentication

**Hook:** `useFirebaseAuth()`

**Import From:** `src/auth/presentation/hooks`

**When to Use:**
- Checking if user is authenticated
- Getting current user information
- Global authentication state
- Protected route components

**State Provided:**
- `user` - Current authenticated user or null
- `isLoading` - True during auth check
- `isAuthenticated` - True if user logged in
- `error` - Any authentication error

**Usage Pattern:**
1. Import hook from auth presentation hooks
2. Call hook in component
3. Check isAuthenticated before showing protected content
4. Show loading indicator during auth check
5. Handle errors appropriately

### For Anonymous Authentication

**Hook:** `useAnonymousAuth()`

**Import From:** `src/auth/presentation/hooks`

**When to Use:**
- Guest access to application
- Temporary user sessions
- Quick onboarding
- Testing without registration

**Methods Provided:**
- `signIn()` - Create anonymous user
- `signOut()` - Sign out anonymous user

**Strategy:**
- Use for quick app tryout
- Prompt to upgrade to permanent account
- Track anonymous user session
- Migrate to permanent account when upgrading

**User Flow:**
1. User launches app
2. Call signIn() automatically or on user action
3. Access app features with limited functionality
4. Prompt to create permanent account
5. Migrate anonymous account to permanent

### For Social Authentication

**Hook:** `useSocialAuth(config)`

**Import From:** `src/auth/presentation/hooks`

**When to Use:**
- Google OAuth sign-in
- Apple ID sign-in (iOS only)
- Primary authentication method
- Account linking

**Configuration:**
- Pass provider configuration (Google Client ID, etc.)
- Apple automatically skipped on Android
- Handle sign-in errors gracefully

**Methods Provided:**
- `signInWithGoogle()` - Google OAuth
- `signInWithApple()` - Apple ID (iOS)
- `signOut()` - Sign out

**Strategy:**
- Use Google as primary auth method
- Use Apple on iOS as alternative
- Handle sign-in errors with user messages
- Implement reauthentication when needed

### For Protected Routes

**Strategy:** Use auth guard service to protect routes.

**Import From:** `src/auth/presentation/hooks` and infrastructure

**When to Use:**
- Pages requiring authentication
- User profile pages
- Dashboard and settings
- Any protected feature

**Implementation:**
1. Use `useFirebaseAuth()` hook
2. Check `isAuthenticated` state
3. Redirect to login if not authenticated
4. Show loading state during check
5. Allow anonymous users if appropriate

**Route Protection Flow:**
1. Component mounts
2. Hook checks auth state
3. If loading, show spinner
4. If authenticated, show protected content
5. If not authenticated, redirect to login

### For Account Deletion

**Strategy:** Use delete account functionality with proper cleanup.

**Import From:** `src/auth` (hooks and infrastructure)

**When to Use:**
- User requests account deletion
- GDPR compliance
- User data cleanup
- Testing

**Implementation:**
1. Confirm deletion with user
2. Delete Auth account
3. Clean up Firestore data (automatic)
4. Clean up Storage files (manual if needed)
5. Sign out and redirect

**Cleanup Considerations:**
- Auth account deleted automatically
- Firestore user data deleted by service
- Storage files may need manual cleanup
- Handle errors appropriately

## Hook Reference

### useFirebaseAuth()

**Import From:** `src/auth/presentation/hooks`

**Purpose:** General authentication state and user information

**Returns:**
- `user: User | null` - Current authenticated user
- `isLoading: boolean` - Auth state loading
- `isAuthenticated: boolean` - User logged in
- `error: Error | null` - Auth error

**Use For:**
- Checking authentication status
- Getting user info
- Protecting routes
- Global auth state

### useAnonymousAuth()

**Import From:** `src/auth/presentation/hooks`

**Purpose:** Anonymous (guest) authentication

**Returns:**
- `user: User | null` - Anonymous user
- `isLoading: boolean` - Operation loading
- `isAuthenticated: boolean` - Guest logged in
- `error: Error | null` - Auth error
- `signIn: () => Promise<void>` - Sign in as guest
- `signOut: () => Promise<void>` - Sign out

**Use For:**
- Guest access
- Temporary sessions
- Quick onboarding
- Testing

### useSocialAuth(config)

**Import From:** `src/auth/presentation/hooks`

**Purpose:** Social authentication (Google, Apple)

**Configuration:**
- `googleClientId?: string` - Google OAuth Client ID
- Apple ID auto-configured (iOS only)

**Returns:**
- `user: User | null` - Authenticated user
- `isLoading: boolean` - Operation loading
- `isAuthenticated: boolean` - User logged in
- `error: Error | null` - Auth error
- `signInWithGoogle: () => Promise<void>` - Google sign-in
- `signInWithApple: () => Promise<void>` - Apple sign-in (iOS)
- `signOut: () => Promise<void>` - Sign out

**Use For:**
- Primary authentication
- Social sign-in
- Account linking
- Reauthentication

## State Management

### Loading States

**Strategy:** Always show loading indicators during auth operations.

**Loading Scenarios:**
- Initial auth check (app startup)
- Sign in operations
- Sign out operations
- Account deletion

**UX Guidelines:**
- Show spinner/indicator during auth operations
- Disable auth buttons during loading
- Don't block UI for initial auth check
- Clear indication of operation in progress

### Error Handling

**Strategy:** Handle all auth errors with user-friendly messages.

**Error Types:**
- Network errors
- Auth provider errors
- Configuration errors
- User cancellation

**Error Handling Approach:**
1. Catch errors in hook
2. Provide in `error` state
3. Display user-friendly message
4. Allow retry if appropriate
5. Log technical errors for debugging

### Authentication State

**States:**
1. **Loading** - Initial auth check in progress
2. **Authenticated** - User logged in
3. **Not Authenticated** - User logged out
4. **Error** - Auth operation failed

**State Flow:**
- Loading → Authenticated (success)
- Loading → Not Authenticated (no user)
- Any → Error (operation failed)

## Common Mistakes to Avoid

1. ❌ Using Firebase Auth SDK directly in components
   - ✅ Always use auth hooks

2. ❌ Not handling loading states
   - ✅ Show loading indicators

3. ❌ Ignoring auth errors
   - ✅ Display error messages to users

4. ❌ Hardcoding auth credentials
   - ✅ Use environment variables

5. ❌ Not protecting routes
   - ✅ Use auth guards

## AI Agent Instructions

### When Creating Auth Hook

1. Import from `src/auth/presentation/hooks`
2. Use appropriate hook for auth type
3. Handle all states (loading, error, authenticated)
4. Provide user feedback
5. Clean up on unmount

### When Protecting Route

1. Use `useFirebaseAuth()` hook
2. Check `isAuthenticated` before showing content
3. Redirect to login if not authenticated
4. Show loading state during check
5. Handle anonymous users appropriately

### When Adding Auth Provider

1. Check existing auth hooks first
2. Follow hook patterns
3. Return consistent interface
4. Handle loading and error states
5. Update this README

## Code Quality Standards

### TypeScript

- All hooks properly typed
- Return interfaces defined
- User type from Firebase Auth
- Error type properly handled

### File Organization

- One hook per file
- Hooks in `presentation/hooks/`
- Services in `infrastructure/services/`
- Stores in `infrastructure/stores/`

### Error Handling

- Never throw from hooks
- Return errors in state
- Provide error context
- Handle edge cases

## Related Documentation

- [Auth Module README](../../README.md)
- [Auth Services README](../../infrastructure/services/README.md)
- [Auth Stores README](../../infrastructure/stores/README.md)
- [Auth Config README](../../infrastructure/config/README.md)

## Architecture

### Hook Layer (Presentation)

**Responsibilities:**
- UI state management
- User interactions
- Loading/error states
- Component integration

**Dependencies:**
- Uses services (infrastructure layer)
- Uses stores (state management)
- Never imports Firebase directly

### Service Layer (Infrastructure)

**Responsibilities:**
- Firebase Auth operations
- Business logic
- Error transformation
- State updates

### Store Layer (Infrastructure)

**Responsibilities:**
- Global auth state
- State persistence
- State updates

## Migration Guide

### From Direct Firebase Auth

**Don't Use:**
- Importing `getAuth` from firebase/auth
- Manual auth state listeners
- Direct signInWithPopup calls
- Manual state management

**Use Instead:**
- `useFirebaseAuth()` for auth state
- `useAnonymousAuth()` for guest access
- `useSocialAuth()` for social sign-in
- Hooks handle everything

## Best Practices

### Component Integration

1. Import hooks from `@umituz/react-native-firebase/auth`
2. Call hooks at component top level
3. Destructure returned values
4. Handle all states
5. Never use Firebase SDK in component

### User Experience

1. Show loading indicators
2. Display clear error messages
3. Disable buttons during operations
4. Provide sign-out option
5. Handle anonymous users appropriately

### Security

1. Never expose auth credentials
2. Use environment variables for config
3. Implement proper route protection
4. Handle auth errors gracefully
5. Log security-relevant events

---

**Last Updated:** 2025-01-08
**Maintainer:** Auth Module Team
