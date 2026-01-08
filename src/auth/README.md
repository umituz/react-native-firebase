# Auth Module

Firebase Authentication module providing comprehensive authentication services and state management.

## 🎯 Purpose

Provides authentication functionality using Firebase Auth JS SDK with a clean, maintainable architecture following Domain-Driven Design principles.

## 📋 For AI Agents

### Before Modifying This Module

1. **READ** this entire README
2. **UNDERSTAND** the architecture (domain → infrastructure → presentation)
3. **FOLLOW** existing patterns - don't reinvent
4. **CHECK** file size limits (max 200 lines per file)
5. **RESPECT** layer boundaries

### Layer Rules

**Domain Layer (`domain/`)**
- Contains business logic, entities, and errors
- No external dependencies (Firebase-free)
- Defines interfaces and value objects

**Infrastructure Layer (`infrastructure/`)**
- Contains Firebase integration and services
- Depends on Firebase SDK
- Implements interfaces defined in domain

**Presentation Layer (`presentation/`)**
- Contains React hooks and UI utilities
- Depends on infrastructure layer
- No business logic

## 🏗️ Architecture

**Directory Structure:**

**domain/** - Business logic (Firebase-free)
- entities/ - Domain entities (AnonymousUser)
- value-objects/ - Value objects (FirebaseAuthConfig)
- errors/ - Domain errors (FirebaseAuthError)

**infrastructure/** - Implementation (Firebase-dependent)
- config/ - Firebase Auth initialization
- services/ - Auth services (Google, Apple, Anonymous)
- stores/ - State management (Zustand)

**presentation/** - UI integration
- hooks/ - React hooks

## ✅ Required Practices

### Authentication Flow

1. **Always use hooks** for auth state in UI components
2. **Initialize Firebase once** at app startup (in infrastructure layer)
3. **Use services** for auth operations (not Firebase SDK directly)
4. **Protect routes** with auth guards
5. **Handle auth errors** with user-friendly messages

### State Management

1. Use Zustand stores for auth state
2. Persist only essential data (user ID, auth status)
3. Don't persist transient states (loading, errors)
4. Clear state on logout

### Error Handling

1. Use domain-specific error classes
2. Never throw primitive values (always Error instances)
3. Include error codes for programmatic handling
4. Log errors appropriately

## 🚫 Forbidden Practices

### ❌ NEVER

- Use Firebase Auth SDK directly in UI components
- Bypass auth services to access Firebase
- Mix architectural layers (e.g., import Firebase in domain layer)
- Create circular dependencies
- Put authentication logic in UI components
- Hardcode credentials or API keys
- Ignore authentication errors

### ⚠️ Avoid

- Multiple Firebase initializations
- Not cleaning up auth listeners
- Storing sensitive data in plain text
- Ignoring auth state changes

## 🎯 Usage Strategies

### For Authentication in UI

**Strategy:** Use React hooks for all auth operations in UI components.

1. Use `useFirebaseAuth` for general auth state
2. Use `useAnonymousAuth` for anonymous authentication
3. Use `useSocialAuth` for Google/Apple authentication
4. Never import Firebase Auth SDK directly in UI

**Correct Pattern:**
- ✅ Use `useFirebaseAuth()` hook for auth state
- ❌ Never import `getAuth` from firebase/auth directly in UI

### For Protected Routes

**Strategy:** Use auth guards to protect routes that require authentication.

1. Use `authGuardService.canActivate()` to check auth status
2. Redirect unauthenticated users to login
3. Handle anonymous users appropriately (allow or deny access)

### For Account Operations

**Strategy:** Use dedicated services for account operations.

1. Use `deleteCurrentUser()` for account deletion (includes Firestore cleanup)
2. Use reauthentication services before sensitive operations
3. Handle errors appropriately

### For Anonymous Users

**Strategy:** Treat anonymous users as temporary accounts.

1. Allow basic functionality for anonymous users
2. Prompt to upgrade to permanent account
3. Track anonymous user session duration
4. Migrate anonymous account to permanent account when upgrading

## 🔧 Service Usage

### Anonymous Authentication

**Service:** `anonymousAuthService` in `infrastructure/services/`

**Usage Strategy:**
- Use for quick onboarding without registration
- Limit functionality for anonymous users
- Prompt users to create permanent account
- Use for temporary data storage

**When to Use:**
- User wants to try the app before signing up
- Temporary session needed
- Testing and demos

### Google Authentication

**Service:** `googleAuthService` in `infrastructure/services/`

**Usage Strategy:**
- Use for Google OAuth sign-in
- Requires Google Client ID configuration
- Handle sign-in errors gracefully

**When to Use:**
- Primary authentication method
- Account linking
- Reauthentication

### Apple Authentication

**Service:** `appleAuthService` in `infrastructure/services/`

**Usage Strategy:**
- Use for Apple ID sign-in on iOS
- Automatically skip on Android
- Handle sign-in errors gracefully

**When to Use:**
- iOS applications
- Alternative to Google sign-in

## 🤖 AI Agent Instructions

### When Adding New Auth Provider

1. Create service in `infrastructure/services/`
2. Follow existing service patterns
3. Return consistent result type: `{ success: boolean; user?: User; error?: Error }`
4. Add error handling
5. Update this README

### When Creating New Hook

1. Place in `presentation/hooks/`
2. Follow existing hook patterns
3. Return consistent interface: `{ user, isLoading, isAuthenticated, error }`
4. Handle loading and error states
5. Update this README

### When Modifying State Management

1. Keep state minimal (only essential data)
2. Use Zustand persist middleware
3. Don't persist transient states
4. Clear state properly on logout
5. Update this README

### File Organization Rules

1. Keep files under 200 lines
2. One service per file
3. One hook per file
4. Group related functionality
5. Extract reusable logic into utilities

## 📏 Code Quality Standards

### File Size

- **Maximum:** 200 lines per file
- **Strategy:** Split large files into smaller modules
- **Example:** If auth service is 300 lines, split into `auth-base.service.ts` and `auth-social.service.ts`

### TypeScript

- Use strict mode
- Define proper types for all functions
- Export types used by other modules
- Never use `any` type

### Naming Conventions

- Files: `kebab-case.ts` (e.g., `google-auth.service.ts`)
- Classes: `PascalCase` (e.g., `GoogleAuthService`)
- Functions/Variables: `camelCase` (e.g., `signInUser`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
- Interfaces/Types: `PascalCase` (e.g., `AuthResult`)

### Error Handling

1. Use `FirebaseAuthError` for auth errors
2. Include error codes
3. Provide context in error messages
4. Never throw primitives

## 📚 Related Documentation

- [Development Guidelines](../../CONTRIBUTING.md)
- [Auth Hooks](./presentation/hooks/README.md)
- [Auth Services](./infrastructure/services/README.md)
- [Auth Domain](./domain/README.md)
- [Auth Configuration](./infrastructure/config/README.md)

## 🔗 API Reference

### Main Exports

**Hooks:**
- `useFirebaseAuth()` - General auth state management
- `useAnonymousAuth()` - Anonymous authentication
- `useSocialAuth(config)` - Social auth (Google, Apple)

**Services:**
- `anonymousAuthService` - Anonymous auth operations
- `googleAuthService` - Google OAuth
- `appleAuthService` - Apple ID auth
- `authGuardService` - Route protection

**Utilities:**
- `checkAuthState()` - Comprehensive auth check
- `getCurrentUserId()` - Get current user ID
- `deleteCurrentUser()` - Delete current account
- And more...

**See:** [Auth Module Index](./index.ts) for complete export list

## 🎓 Key Concepts

### Domain-Driven Design in Auth

**Why DDD?**
- Separates business logic from Firebase SDK
- Makes code testable without Firebase
- Allows easy switching of auth providers
- Clean architecture

**How it works:**
1. **Domain layer** defines what auth operations exist
2. **Infrastructure layer** implements them with Firebase
3. **Presentation layer** exposes them to React Native

### Repository Pattern

**Note:** Auth doesn't use repository pattern (that's for Firestore). Auth uses **Service Pattern** instead.

### State Management

**Why Zustand?**
- Simple and lightweight
- Built-in persist middleware
- Easy to test
- No boilerplate

## 🚨 Common Mistakes to Avoid

1. ❌ Using Firebase Auth SDK directly in components
   - ✅ Use hooks instead

2. ❌ Not cleaning up auth listeners
   - ✅ Always cleanup on unmount

3. ❌ Hardcoding auth configuration
   - ✅ Use environment variables

4. ❌ Ignoring auth errors
   - ✅ Handle errors appropriately

5. ❌ Creating circular dependencies
   - ✅ Respect layer boundaries

## 📝 Module Maintenance

### When Code Changes

1. Update this README if behavior changes
2. Add new forbidden practices as needed
3. Update AI instructions for new patterns
4. Keep documentation in sync

### When Adding New Features

1. Consider architectural impact
2. Place in correct layer
3. Follow existing patterns
4. Add error handling
5. Update documentation

---

**Last Updated:** 2025-01-08
**Maintainer:** Auth Module Team
