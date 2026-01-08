# Auth Services

Firebase Authentication service layer providing authentication operations, utilities, and guards.

## Purpose

Provides service layer for Firebase Authentication including anonymous auth, Google OAuth, Apple Auth, reauthentication, account deletion, auth guards, and auth-related Firestore utilities.

## For AI Agents

### Before Using Auth Services

1. **USE** services (never Firebase Auth SDK directly in UI)
2. **HANDLE** service results properly
3. **CHECK** success property before using data
4. **HANDLE** errors appropriately
5. **USE** auth guards for protected routes

### Required Practices

1. **Use services** - Import from auth infrastructure/services
2. **Check results** - Always check success property
3. **Handle errors** - Display user-friendly messages
4. **Use guards** - Protect routes with authGuardService
5. **Clean up** - Delete Firestore data on account deletion

### Forbidden Practices

## ❌ NEVER

- Use Firebase Auth SDK directly in UI components
- Ignore success property in results
- Skip error handling
- Mix service concerns
- Delete Auth without Firestore cleanup

## ⚠️ Avoid

- Not checking success before using user data
- Showing technical error messages
- Not using auth guards for protected routes
- Forgetting to delete Firestore data
- Hardcoding auth configuration

## Service Overview

### AnonymousAuthService

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

**Purpose:** Handle anonymous (guest) user authentication

**Methods:**
- `signIn()` - Sign in as anonymous user

**Returns:** `Promise<AnonymousAuthResult>`
- `success: boolean` - Operation succeeded
- `user?: User` - Authenticated user
- `error?: Error` - Error if failed

**Usage Strategy:**
1. Call signIn() for guest access
2. Check success property
3. Access user data if successful
4. Handle errors appropriately
5. Prompt to upgrade to permanent account

**When to Use:**
- Quick app tryout without registration
- Temporary user sessions
- Testing without credentials
- Guest access with limited functionality

### GoogleAuthService

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

**Purpose:** Handle Google OAuth authentication

**Methods:**
- `signIn(config)` - Sign in with Google

**Parameters:**
- `config: GoogleAuthConfig`
  - `clientId: string` - Google OAuth Client ID

**Returns:** `Promise<GoogleAuthResult>`
- `success: boolean` - Operation succeeded
- `user?: User` - Authenticated user
- `idToken?: string` - Google ID token
- `error?: Error` - Error if failed

**Usage Strategy:**
1. Configure with Google Client ID
2. Call signIn() on user action
3. Check success property
4. Access user and idToken if successful
5. Handle errors gracefully

**When to Use:**
- Primary authentication method
- Google account sign-in
- Account linking
- Reauthentication

### AppleAuthService

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

**Purpose:** Handle Apple ID authentication (iOS only)

**Methods:**
- `signIn()` - Sign in with Apple ID

**Returns:** `Promise<AppleAuthResult>`
- `success: boolean` - Operation succeeded
- `user?: User` - Authenticated user
- `authorizationCode?: string` - Apple authorization code
- `error?: Error` - Error if failed

**Usage Strategy:**
1. Call signIn() on user action (iOS only)
2. Automatically skipped on Android
3. Check success property
4. Access user data if successful
5. Handle errors appropriately

**When to Use:**
- iOS applications
- Alternative to Google sign-in
- Privacy-focused authentication
- Account linking

## Account Operations

### ReauthenticationService

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

**Purpose:** Handle user reauthentication for sensitive operations

**Methods:**
- `reauthenticate(user)` - Reauthenticate current user

**When to Use:**
- Before account deletion
- Before password change
- Before sensitive operations
- Email verification

**Strategy:**
1. Verify user identity
2. Call reauthenticate method
3. Handle reauthentication
4. Proceed with sensitive operation
5. Handle errors appropriately

### Account Deletion Service

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

**Purpose:** Handle complete account deletion including Auth and Firestore data

**Methods:**
- `deleteCurrentUser()` - Delete current user account

**Cleanup Process:**
1. Delete Firebase Auth account
2. Automatically delete Firestore user data
3. Clean up Storage files (manual if needed)
4. Sign out user
5. Navigate to login screen

**When to Use:**
- User requests account deletion
- GDPR compliance
- User data cleanup
- Account testing

**Strategy:**
1. Confirm deletion with user
2. Call deleteCurrentUser()
3. Auth deletion automatic
4. Firestore cleanup automatic
5. Manual Storage cleanup if needed

## Route Protection

### AuthGuardService

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

**Purpose:** Protect routes that require authentication

**Methods:**
- `canActivate()` - Check if route can be activated
- `canActivateAnonymous()` - Check if anonymous users allowed

**Returns:** `boolean` - Whether route can be accessed

**Usage Strategy:**
1. Use in protected route components
2. Check canActivate() before rendering
3. Redirect to login if not authenticated
4. Handle anonymous users appropriately
5. Show loading state during check

**When to Use:**
- Pages requiring authentication
- User profile pages
- Dashboard and settings
- Protected features

## Firestore Utilities

### AuthFirestoreUtils

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

**Purpose:** Helper functions for auth-related Firestore operations

**Utilities:**
- User document path resolution
- User data creation/update
- User data cleanup on deletion
- Auth state synchronization

**When to Use:**
- Creating user documents in Firestore
- Updating user profile data
- Cleaning up user data
- Syncing auth state with database

## Service Result Types

### AuthResult Pattern

**Import From:** All auth services return similar result types

**Common Properties:**
- `success: boolean` - Operation succeeded
- `user?: User` - Authenticated user (when applicable)
- `error?: Error` - Error if operation failed

**Usage:**
1. Call service method
2. Check result.success
3. Use result.user if success
4. Handle result.error if failed
5. Never assume success

## Common Mistakes to Avoid

1. ❌ Not checking success property
   - ✅ Always check result.success first

2. ❌ Using Firebase Auth SDK directly
   - ✅ Use auth services

3. ❌ Not handling errors
   - ✅ Check result.error and display message

4. ❌ Deleting Auth without Firestore cleanup
   - ✅ Use deleteCurrentUser() for complete cleanup

5. ❌ Not protecting routes
   - ✅ Use authGuardService

## AI Agent Instructions

### When Using Auth Services

1. Import service from auth infrastructure/services
2. Call service method with appropriate parameters
3. Check result.success property
4. Use result.user data if successful
5. Handle result.error appropriately

### When Protecting Route

1. Use authGuardService.canActivate()
2. Check result before showing protected content
3. Redirect to login if not authenticated
4. Handle anonymous users appropriately
5. Show loading state during check

### When Deleting Account

1. Confirm deletion with user
2. Call deleteCurrentUser() service
3. Firestore cleanup automatic
4. Clean up Storage files if needed
5. Sign out and navigate to login

## Code Quality Standards

### TypeScript

- Type all service methods
- Use proper result types
- Handle errors with types
- Export service instances
- Document service behavior

### Error Handling

- Always return success property
- Include error details
- Provide context in errors
- Handle edge cases
- Test error flows

## Related Documentation

- [Auth Module README](../../README.md)
- [Auth Stores README](../stores/README.md)
- [Auth Hooks README](../../presentation/hooks/README.md)
- [Auth Errors README](../../domain/errors/README.md)

## API Reference

### Main Services

**Import Path:** `@umituz/react-native-firebase/auth` or `src/auth/infrastructure/services`

| Service | Purpose | Methods |
|---------|---------|---------|
| `anonymousAuthService` | Anonymous authentication | `signIn()` |
| `googleAuthService` | Google OAuth | `signIn(config)` |
| `appleAuthService` | Apple ID authentication | `signIn()` |
| `authGuardService` | Route protection | `canActivate()`, `canActivateAnonymous()` |
| `reauthenticationService` | User reauthentication | `reauthenticate(user)` |
| `accountDeletionService` | Account deletion | `deleteCurrentUser()` |

### Result Types

| Type | Properties |
|------|------------|
| `AnonymousAuthResult` | success, user?, error? |
| `GoogleAuthResult` | success, user?, idToken?, error? |
| `AppleAuthResult` | success, user?, authorizationCode?, error? |

---

**Last Updated:** 2025-01-08
**Maintainer:** Auth Module Team
