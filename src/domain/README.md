# Shared Domain

Shared domain models, types, and business logic used across multiple modules.

## Purpose

Implements Domain-Driven Design (DDD) principles with shared domain entities, value objects, business rules, and domain errors used by Auth, Firestore, and Storage modules.

## For AI Agents

### Before Using Shared Domain

1. **UNDERSTAND** DDD architecture principles
2. **USE** value objects for business concepts
3. **DEFINE** business rules in domain
4. **VALIDATE** invariants in domain
5. **NEVER** import Firebase SDK in domain layer

### Required Practices

1. **Keep domain Firebase-free** - No Firebase imports in domain
2. **Use value objects** - For business concepts with behavior
3. **Validate invariants** - In constructors/factory methods
4. **Define business rules** - In domain services
5. **Use Result types** - For error handling

### Forbidden Practices

## ❌ NEVER

- Import Firebase SDK in domain layer
- Create anemic domain models (data without behavior)
- Put business logic in infrastructure
- Skip domain validation
- Leaky domain boundaries

## ⚠️ Avoid

- Primitive obsession (use value objects)
- Business logic in UI/components
- Missing domain validation
- Weak domain boundaries
- Unclear business rules

## Common Types

### User Types

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Types:**
- `BaseUser` - Base user interface with common properties
- `AuthUser` - Firebase Auth user (extends BaseUser)
- `DatabaseUser` - Firestore database user (extends BaseUser)

**Properties:**
- `uid: string` - Unique user identifier
- `email?: string | null` - User email
- `displayName?: string | null` - Display name
- `photoURL?: string | null` - Profile photo URL

**Usage Strategy:**
1. Use BaseUser for shared properties
2. Use AuthUser for authentication-specific data
3. Use DatabaseUser for Firestore data
4. Type user parameters appropriately
5. Distinguish between auth and database users

**When to Use:**
- User type annotations
- Function parameters
- Type checking
- User data validation
- Type-safe operations

### Timestamp Types

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Types:**
- `ISOString` - ISO string timestamp type
- `Timestampable` - Entities with timestamps
- `Trackable` - Entities with user tracking
- `SoftDeletable` - Entities with soft delete

**Properties:**
- `createdAt: ISOString` - Creation timestamp
- `updatedAt: ISOString` - Update timestamp
- `createdBy: string` - Creator user ID
- `updatedBy: string` - Updater user ID
- `deletedAt?: ISOString` - Deletion timestamp
- `isDeleted: boolean` - Deletion status

**Usage Strategy:**
1. Use Timestampable for audit trails
2. Use Trackable for user tracking
3. Use SoftDeletable for soft deletes
4. Extend interfaces as needed
5. Store timestamps as ISO strings

**When to Use:**
- Entity definitions
- Audit trails
- User tracking
- Soft delete implementation
- Data lifecycle management

### Entity Types

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Types:**
- `Identifiable` - Entities with ID
- `Named` - Entities with name
- `Described` - Entities with description
- `BaseEntity` - Complete base entity

**Properties:**
- `id: string` - Entity identifier
- `name: string` - Entity name
- `description: string` - Entity description
- `createdAt: string` - Creation timestamp
- `updatedAt: string` - Update timestamp

**Usage Strategy:**
1. Extend Identifiable for all entities
2. Add Named/Described as needed
3. Use BaseEntity for common entity pattern
4. Combine interfaces for specific needs
5. Ensure all entities have ID

**When to Use:**
- Entity definitions
- Type safety
- Common entity properties
- Domain modeling
- Data structure validation

## Value Objects

### Email

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Purpose:** Immutable value object for email validation

**Methods:**
- `static create(email)` - Factory method (returns null if invalid)
- `getValue()` - Get email string
- `getDomain()` - Get email domain
- `equals(other)` - Compare emails

**Usage Strategy:**
1. Use Email.create() to create instances
2. Validate email on creation
3. Auto-normalizes to lowercase
4. Use getValue() for string access
5. Compare with equals() method

**When to Use:**
- Email input validation
- User registration
- Email comparison
- Email domain extraction
- Type-safe email operations

### UserId

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Purpose:** Value object for user identification

**Methods:**
- `static create(value)` - Create from string
- `static generate()` - Generate new UUID
- `getValue()` - Get user ID string
- `equals(other)` - Compare user IDs
- `toString()` - Convert to string

**Usage Strategy:**
1. Use UserId.create() for existing IDs
2. Use UserId.generate() for new IDs
3. Validate ID format on creation
4. Use equals() for comparison
5. Type-safe user ID operations

**When to Use:**
- User identification
- Type-safe ID operations
- ID validation
- UUID generation
- User references

### Money

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Purpose:** Value object for monetary amounts

**Methods:**
- `static create(amount, currency?)` - Create money value
- `getAmount()` - Get amount
- `getCurrency()` - Get currency code
- `add(other)` - Add money values
- `subtract(other)` - Subtract money values
- `format()` - Format for display

**Usage Strategy:**
1. Use Money.create() for instances
2. Specify currency (default: USD)
3. Use add/subtract for operations
4. Currency matching enforced
5. Format for display

**When to Use:**
- Payment processing
- Price calculations
- Currency operations
- Financial display
- Type-safe money operations

## Domain Errors

### Result Type

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Purpose:** Type-safe error handling without exceptions

**Type:** `Result<T, E = Error>`

**Shape:**
- Success: `{ success: true; data: T }`
- Failure: `{ success: false; error: E }`

**Usage Strategy:**
1. Return Result type from operations
2. Check success property
3. Access data or error accordingly
4. Handle both success and failure
5. Avoid throwing exceptions

**When to Use:**
- Domain operations
- Service layer
- Error handling
- Validation results
- Type-safe operations

### ValidationError

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Purpose:** Error for validation failures

**Properties:**
- `message: string` - Error message
- `field: string` - Field that failed validation
- `code: string` - Error code

**Usage Strategy:**
1. Throw when validation fails
2. Include field name
3. Provide error code
4. Display field-specific errors
5. Use for form validation

**When to Use:**
- Input validation
- Form validation
- Field-specific errors
- Validation failures
- User feedback

### NotFoundError

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Purpose:** Error when resource not found

**Parameters:**
- `resource: string` - Resource type
- `id: string` - Resource identifier

**Usage Strategy:**
1. Throw when resource not found
2. Include resource type and ID
3. Use in repository operations
4. Handle with user-friendly message
5. Log for debugging

**When to Use:**
- Repository operations
- Resource lookups
- Data fetching
- Entity not found
- Missing data scenarios

## Business Rules

### Email Validation

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Functions:**
- `isValidEmail(email)` - Validate email format
- `normalizeEmail(email)` - Normalize email to lowercase

**Usage Strategy:**
1. Validate before storage
2. Normalize to lowercase
3. Use on user input
4. Validate on registration
5. Check before sending emails

**When to Use:**
- User registration
- Email updates
- Email validation
- Input sanitization
- Data normalization

### Password Validation

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Function:** `validatePassword(password, policy)`

**Policy Interface:**
- `minLength: number` - Minimum length
- `requireUppercase: boolean` - Require uppercase
- `requireLowercase: boolean` - Require lowercase
- `requireNumbers: boolean` - Require numbers
- `requireSpecialChars: boolean` - Require special characters

**Returns:** `{ valid: boolean; errors: string[] }`

**Usage Strategy:**
1. Define password policy
2. Validate password on creation
3. Display validation errors
4. Enforce policy consistently
5. Show specific error messages

**When to Use:**
- User registration
- Password updates
- Password strength validation
- Security requirements
- User feedback

### ID Validation

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Functions:**
- `isValidId(id)` - Validate ID format
- `requireValidId(id)` - Throw if invalid

**Supported Formats:**
- UUID format
- Firebase ID format

**Usage Strategy:**
1. Validate IDs before operations
2. Use requireValidId for critical operations
3. Check format on user input
4. Validate IDs from external sources
5. Throw descriptive errors

**When to Use:**
- ID validation
- Parameter validation
- Security checks
- Data integrity
- Input sanitization

## Utility Functions

### Date Utilities

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Functions:**
- `getCurrentISO()` - Get current ISO timestamp
- `isRecent(isoString, days?)` - Check if date is recent
- `daysFromNow(isoString)` - Calculate days difference

**Usage Strategy:**
1. Use getCurrentISO for timestamps
2. Check isRecent for recent dates
3. Calculate days difference
4. Store dates as ISO strings
5. Parse ISO strings for calculations

**When to Use:**
- Timestamp generation
- Date calculations
- Recent date checks
- Age calculations
- Date comparisons

### String Utilities

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Functions:**
- `slugify(text)` - Convert text to slug
- `truncate(text, maxLength)` - Truncate text with ellipsis
- `generateRandomString(length?)` - Generate random string

**Usage Strategy:**
1. Use slugify for URLs
2. Use truncate for display
3. Generate random strings for tokens
4. Sanitize user input
5. Format text appropriately

**When to Use:**
- URL generation
- Text display
- Token generation
- Input sanitization
- Text formatting

### Collection Utilities

**Import From:** `@umituz/react-native-firebase/domain` or `src/domain`

**Functions:**
- `chunk(array, size)` - Split array into chunks
- `groupBy(array, keyFn)` - Group array by key
- `uniqueBy(array, keyFn)` - Get unique items

**Usage Strategy:**
1. Use chunk for batch operations
2. Use groupBy for data organization
3. Use uniqueBy for deduplication
4. Process large arrays efficiently
5. Organize data structures

**When to Use:**
- Batch operations
- Data organization
- Deduplication
- Data processing
- Array manipulation

## Common Mistakes to Avoid

1. ❌ Using primitive strings for business concepts
   - ✅ Use value objects (Email, UserId, Money)

2. ❌ Business logic in infrastructure
   - ✅ Put business logic in domain

3. ❌ Throwing exceptions without handling
   - ✅ Use Result types for error handling

4. ❌ Skipping validation
   - ✅ Validate invariants in domain

5. ❌ Anemic domain models
   - ✅ Add behavior to entities and value objects

## AI Agent Instructions

### When Creating Value Object

1. Identify business concept
2. Create immutable class
3. Add validation on creation
4. Provide factory methods
5. Add behavior methods
6. Use for type safety

### When Creating Domain Error

1. Extend Error class
2. Add relevant properties
3. Provide clear messages
4. Include error codes
5. Use for specific scenarios

### When Implementing Business Rule

1. Define rule clearly
2. Implement in domain
3. Validate inputs
4. Return meaningful results
5. Document behavior

### When Using Result Type

1. Return Result from operations
2. Check success flag
3. Handle both cases
4. Avoid exceptions
5. Provide clear errors

## Code Quality Standards

### Domain Layer

- No Firebase imports
- Pure TypeScript
- Business logic only
- Type-safe operations
- Clear interfaces

### Value Objects

- Immutable by design
- Validate on creation
- Encapsulate behavior
- Factory methods
- Equality checks

### Error Handling

- Use Result types
- Type-safe errors
- Clear error messages
- Error codes
- Proper inheritance

## Performance Considerations

### Value Objects

- Lightweight creation
- Minimal memory overhead
- Efficient equality checks
- Immutable (no mutation costs)
- Reuse when possible

### Validation

- Validate early
- Fail fast
- Clear error messages
- Efficient validation logic
- Cache validation when appropriate

### Collections

- Efficient algorithms
- Lazy evaluation when possible
- Memory-conscious operations
- Batch processing
- Avoid unnecessary iterations

## Related Documentation

- [Auth Domain README](../auth/domain/README.md)
- [Firestore Domain README](../firestore/domain/README.md)
- [Domain Errors README](../auth/domain/errors/README.md)

## API Reference

### Types

**Import Path:** `@umituz/react-native-firebase/domain` or `src/domain`

| Type | Description |
|------|-------------|
| `BaseUser` | Base user interface |
| `AuthUser` | Firebase Auth user |
| `DatabaseUser` | Firestore database user |
| `ISOString` | ISO string timestamp |
| `Timestampable` | Timestamps (createdAt, updatedAt) |
| `Trackable` | User tracking (createdBy, updatedBy) |
| `SoftDeletable` | Soft delete support |
| `Identifiable` | Entity with ID |
| `BaseEntity` | Complete base entity |
| `Result<T, E>` | Result type for error handling |

### Value Objects

**Import Path:** `@umituz/react-native-firebase/domain` or `src/domain`

| Class | Factory Methods | Description |
|-------|----------------|-------------|
| `Email` | `create(email)` | Email value object |
| `UserId` | `create(value), generate()` | User ID value object |
| `Money` | `create(amount, currency?)` | Money value object |

### Domain Errors

**Import Path:** `@umituz/react-native-firebase/domain` or `src/domain`

| Error | Properties | Description |
|-------|------------|-------------|
| `ValidationError` | `message, field, code` | Validation failure |
| `NotFoundError` | `message` | Resource not found |

### Validation Functions

**Import Path:** `@umituz/react-native-firebase/domain` or `src/domain`

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `isValidEmail` | `email` | `boolean` | Validate email format |
| `normalizeEmail` | `email` | `string` | Normalize email |
| `validatePassword` | `password, policy` | `{valid, errors}` | Validate password |
| `isValidId` | `id` | `boolean` | Validate ID format |
| `requireValidId` | `id` | `void` | Require valid ID |

### Utility Functions

**Import Path:** `@umituz/react-native-firebase/domain` or `src/domain`

| Function | Parameters | Returns | Description |
|----------|------------|---------|-------------|
| `getCurrentISO` | - | `string` | Current timestamp |
| `isRecent` | `isoString, days?` | `boolean` | Check if recent |
| `daysFromNow` | `isoString` | `number` | Days difference |
| `slugify` | `text` | `string` | Convert to slug |
| `truncate` | `text, maxLength` | `string` | Truncate text |
| `generateRandomString` | `length?` | `string` | Random string |
| `chunk` | `array, size` | `T[][]` | Split array |
| `groupBy` | `array, keyFn` | `Record<string, T[]>` | Group by key |
| `uniqueBy` | `array, keyFn` | `T[]` | Unique items |

---

**Last Updated:** 2025-01-08
**Maintainer:** Domain Layer Team
