# Auth Domain

Domain layer for Firebase Authentication containing business logic, entities, value objects, and domain errors.

## Purpose

Implements Domain-Driven Design (DDD) principles for Authentication, separating business logic from infrastructure concerns and providing a clean architecture.

## For AI Agents

### Before Using Auth Domain

1. **UNDERSTAND** DDD architecture (domain → infrastructure → presentation)
2. **USE** domain entities (not infrastructure)
3. **NEVER** import Firebase SDK in domain layer
4. **DEFINE** business rules in domain
5. **KEEP** domain layer Firebase-free

### Required Practices

1. **Keep domain Firebase-free** - No Firebase imports
2. **Define entities** - Business entities with behavior
3. **Create value objects** - Immutable configuration types
4. **Define domain errors** - Custom error classes
5. **Write business logic** - In domain, not infrastructure

### Forbidden Practices

## ❌ NEVER

- Import Firebase Auth SDK in domain layer
- Mix infrastructure concerns in domain
- Create anemic domain models
- Skip domain validation
- Put business logic in infrastructure

## ⚠️ Avoid

- Leaking domain logic to infrastructure
- Not validating business rules
- Missing domain entities
- Complex domain services
- Unclear domain boundaries

## Domain Layer Structure

### Organization

**Import From:** `src/auth/domain`

**Structure:**
- `entities/` - Business entities (AnonymousUser)
- `value-objects/` - Value objects (FirebaseAuthConfig)
- `errors/` - Domain errors (FirebaseAuthError)

**Principles:**
- No external dependencies (Firebase-free)
- Pure business logic
- Type-safe entities
- Clear boundaries
- Testable in isolation

## Entities

### AnonymousUser

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain`

**Purpose:** Represents an anonymous (guest) user in the system

**Properties:**
- `uid: string` - Unique user identifier
- `isAnonymous: true` - Always true for anonymous users
- `createdAt?: Date` - Account creation timestamp

**Type Guards:**
- `isAnonymousUser(user)` - Check if user is anonymous
- `isValidAnonymousUser(user)` - Validate anonymous user
- `toAnonymousUser(user)` - Convert to AnonymousUser entity

**Usage:**
- Identify anonymous users
- Validate user type
- Type-safe operations
- Business logic for guest users

**When to Use:**
- Checking user type
- Guest access logic
- Temporary session handling
- Account upgrade scenarios

**Business Rules:**
- Anonymous users have limited functionality
- Should prompt to upgrade to permanent account
- Track anonymous session duration
- Migrate data on upgrade

## Value Objects

### FirebaseAuthConfig

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain`

**Purpose:** Immutable configuration for Firebase Authentication

**Properties:**
- Configuration values for auth providers
- API keys and client IDs
- Environment-specific settings

**Characteristics:**
- Immutable value object
- Validated on creation
- Type-safe configuration
- Environment-aware

**When to Use:**
- Initializing auth services
- Configuring auth providers
- Environment-specific settings
- Auth service setup

## Domain Errors

### FirebaseAuthError

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

**Purpose:** Base error class for all Firebase Auth errors

**Properties:**
- `code: string` - Error code for programmatic handling
- `message: string` - Human-readable error message

**Usage:**
- Throwing custom auth errors
- Type checking with instanceof
- Error code for conditional logic
- Structured error handling

**When to Use:**
- Auth operation failures
- Type-safe error handling
- User-friendly error messages
- Error logging and tracking

### FirebaseAuthInitializationError

**Import From:** `@umituz/react-native-firebase/auth` or `src/auth/domain/errors`

**Purpose:** Error thrown when Firebase Auth fails to initialize

**Extends:** FirebaseAuthError

**When to Use:**
- Auth initialization failures
- Configuration errors
- Firebase setup issues

## Common Mistakes to Avoid

1. ❌ Importing Firebase Auth in domain layer
   - ✅ Keep domain Firebase-free

2. ❌ Anemic domain models
   - ✅ Add behavior to entities

3. ❌ Business logic in infrastructure
   - ✅ Put business logic in domain

4. ❌ Not validating business rules
   - ✅ Validate in domain layer

5. ❌ Leaking domain logic
   - ✅ Keep domain logic contained

## AI Agent Instructions

### When Creating Domain Entity

1. Define entity interface
2. Add business logic methods
3. Validate invariants
4. Keep Firebase-free
5. Export for infrastructure use

### When Creating Value Object

1. Identify configuration values
2. Create immutable type
3. Validate on creation
4. Provide factory methods
5. Use for configuration

### When Creating Domain Error

1. Extend base error class
2. Add error code
3. Provide clear message
4. Include context
5. Export for use

## Code Quality Standards

### Domain Layer

- No Firebase imports
- Pure TypeScript
- Business logic only
- Type-safe entities
- Clear interfaces

### Testing

- Test domain in isolation
- Mock infrastructure
- Test business rules
- Validate invariants
- Unit test coverage

## Related Documentation

- [Auth Module README](../../README.md)
- [Auth Infrastructure README](../../infrastructure/README.md)
- [Auth Errors README](../errors/README.md)
- [Anonymous User Entity README](../entities/README.md)

## Architecture

### Domain Layer Responsibilities

**What Domain Does:**
- Defines business entities
- Contains business logic
- Validates business rules
- Provides domain services
- Defines domain errors

**What Domain Doesn't Do:**
- No Firebase SDK usage
- No auth operations
- No HTTP requests
- No external integrations
- No UI concerns

### DDD Principles

**Strategic Patterns:**
- Entities (identity-based objects)
- Value Objects (immutable values)
- Domain Services (stateless operations)
- Aggregates (consistency boundaries)
- Repositories (infrastructure concern)

**Tactical Patterns:**
- Factory (creation)
- Strategy (algorithms)
- Specification (business rules)

---

**Last Updated:** 2025-01-08
**Maintainer:** Auth Module Team
