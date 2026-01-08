# Firestore Domain

Domain layer for Firestore module containing business logic, entities, value objects, errors, and domain services.

## Purpose

Implements Domain-Driven Design (DDD) principles for Firestore, separating business logic from infrastructure concerns and providing a clean architecture.

## For AI Agents

### Before Using Firestore Domain

1. **UNDERSTAND** DDD architecture (domain → infrastructure → presentation)
2. **USE** domain entities (not infrastructure)
3. **NEVER** import Firebase SDK in domain layer
4. **DEFINE** business logic in domain
5. **KEEP** domain layer Firebase-free

### Required Practices

1. **Keep domain Firebase-free** - No Firebase imports in domain
2. **Define entities** - Business entities with behavior
3. **Create value objects** - Immutable value types
4. **Define domain errors** - Custom error classes
5. **Write domain services** - Business logic services

### Forbidden Practices

## ❌ NEVER

- Import Firebase SDK in domain layer
- Mix infrastructure concerns in domain
- Create anemic domain models (data without behavior)
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

**Import From:** `src/firestore/domain`

**Structure:**
- `entities/` - Business entities (QuotaMetrics, RequestLog)
- `services/` - Domain services (QuotaCalculator)
- `constants/` - Domain constants (QuotaLimits)
- `errors/` - Domain errors (FirebaseFirestoreError)

**Principles:**
- No external dependencies (Firebase-free)
- Pure business logic
- Type-safe entities
- Clear boundaries
- Testable in isolation

## Entities

### QuotaMetrics

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain`

**Purpose:** Represents Firestore quota usage metrics

**Properties:**
- `totalReads: number` - Total read operations
- `totalWrites: number` - Total write operations
- `totalDeletes: number` - Total delete operations
- `reads: QuotaStatus` - Read quota details
- `writes: QuotaStatus` - Write quota details
- `deletes: QuotaStatus` - Delete quota details

**QuotaStatus Properties:**
- `used: number` - Amount used
- `limit: number` - Total limit
- `percentage: number` - Usage percentage (0-100)

**Usage:**
- Track quota usage
- Display usage to users
- Check thresholds
- Calculate remaining quota
- Monitor trends

**When to Use:**
- After quota calculations
- Displaying quota status
- Checking thresholds
- Monitoring usage
- Cost analysis

### RequestLog

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain`

**Purpose:** Log entry for a Firestore request

**Properties:**
- `type: RequestType` - Operation type ('read', 'write', 'delete')
- `collectionName: string` - Collection being accessed
- `documentCount: number` - Number of documents affected
- `timestamp: number` - Unix timestamp of request
- `queryHash?: string` - Hash of query for duplicate detection

**Usage:**
- Create log entry before operation
- Populate with operation details
- Store for analytics and monitoring
- Use queryHash for deduplication

**When to Use:**
- Repository operations (read, write, delete)
- Quota tracking middleware
- Performance monitoring
- Analytics and reporting

## Value Objects

### QuotaStatus

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain`

**Purpose:** Represents quota usage status for a single operation type

**Properties:**
- `used: number` - Amount used
- `limit: number` - Total limit
- `percentage: number` - Usage percentage

**Characteristics:**
- Immutable value object
- Used in QuotaMetrics
- Calculated from raw counts
- Used for threshold checking

**When to Use:**
- Calculating quota usage
- Checking thresholds
- Displaying quota status
- Monitoring limits

## Domain Services

### QuotaCalculator

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/services`

**Purpose:** Business logic for quota calculations

**Responsibilities:**
- Calculate quota usage percentages
- Check quota thresholds
- Calculate remaining quota
- Validate quota limits

**Methods:**
- Calculate usage from operation counts
- Compare against thresholds
- Return QuotaMetrics object

**When to Use:**
- After batch operations
- Displaying quota status
- Checking before large operations
- Monitoring usage trends

## Domain Constants

### QuotaLimits

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/constants`

**Purpose:** Firebase free tier quota limits

**Constants:**
- Daily read limit (50,000)
- Daily write limit (20,000)
- Monthly delete limit (20,000)

**Usage:**
- Quota calculations
- Display limits to users
- Calculate remaining quota
- Set up monitoring

**When to Use:**
- Calculating quota usage
- Displaying quota information
- Setting up alerts
- Checking remaining quota

## Domain Errors

### FirebaseFirestoreError

**Import From:** `@umituz/react-native-firebase/firestore` or `src/firestore/domain/errors`

**Purpose:** Base error class for all Firestore errors

**Properties:**
- `code: string` - Error code
- `message: string` - Error message

**Hierarchy:**
- FirebaseFirestoreError (base)
  - FirebaseFirestoreInitializationError
  - FirebaseFirestoreQuotaError

**When to Use:**
- Throwing custom Firestore errors
- Type-safe error handling
- Error code for conditional logic
- Structured error information

## Common Mistakes to Avoid

1. ❌ Importing Firebase in domain layer
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

### When Creating Domain Service

1. Identify business logic
2. Create service class
3. Implement business rules
4. Keep pure functions
5. Test in isolation

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

- [Firestore Module README](../../README.md)
- [Firestore Infrastructure README](../../infrastructure/README.md)
- [Firestore Errors README](../errors/README.md)
- [Quota Constants README](../constants/README.md)

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
- No database operations
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
**Maintainer:** Firestore Module Team
