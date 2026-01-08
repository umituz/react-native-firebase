# Path Resolver

Standardized Firestore path resolution for user-specific collections following the pattern `users/{userId}/{collectionName}`.

## Purpose

Enforces consistent path structure across all applications using this package. All user data MUST follow the pattern `users/{userId}/{collectionName}` for maintainability and security.

## For AI Agents

### Before Using Path Resolver

1. **FOLLOW** the standard pattern strictly
2. **NEVER** deviate from `users/{userId}/{collectionName}` structure
3. **USE** resolver instead of manual path construction
4. **VALIDATE** userId and documentId parameters

### Required Practices

1. **Always use** FirestorePathResolver for user collections
2. **Follow** the standard pattern: `users/{userId}/{collectionName}`
3. **Use** getUserCollection for collection references
4. **Use** getDocRef for document references
5. **Handle** null return (db not initialized)

### Forbidden Practices

## ❌ NEVER

- Create user collections outside `users/{userId}/` path
- Use manual path construction with string templates
- Deviate from the standard pattern
- Create collections at root level for user data
- Hardcode collection paths

## ⚠️ Avoid

- Nested paths deeper than 2 levels under users
- Shared collections (non-user-specific)
- Inconsistent naming conventions
- Missing userId in path

## Path Structure Strategy

### Standard Pattern

**Mandatory Pattern:** `users/{userId}/{collectionName}`

**Why This Pattern?**
- Consistent across all apps using this package
- Easy security rules implementation
- Simple data export/deletion
- Predictable query patterns
- Multi-tenant support

**Examples:**
- users/user123/posts
- users/user123/profile
- users/user456/settings
- users/user456/notifications

### Document Pattern

**Document Path:** `users/{userId}/{collectionName}/{documentId}`

**When to Use:**
- Referencing specific documents
- Updating individual items
- Deleting specific records

### Forbidden Patterns

## ❌ These Patterns Are FORBIDDEN

**Root level collections:**
- posts
- users
- settings

**Non-standard user paths:**
- user_data/{userId}/posts
- userdata/{userId}/profile
- app/{userId}/items

**Too deep nesting:**
- users/{userId}/posts/{postId}/comments/{commentId}/replies

## Usage Strategies

### For User Collections

**Strategy:** Create one resolver instance per collection.

**When to Use:**
- Accessing user-specific data
- Creating repositories
- Building queries for user data

**Approach:**
1. Instantiate resolver with collection name
2. Use getUserCollection for collection operations
3. Use getDocRef for document operations

### For Repositories

**Strategy:** Use resolver in repository constructors.

**When to Use:**
- Creating custom repositories
- Extending base repository classes
- Implementing data access layers

**Approach:**
1. Store resolver instance in repository
2. Use in all Firestore operations
3. Never construct paths manually

### For Security

**Strategy:** Follow path pattern for security rules.

**When to Use:**
- Writing Firestore security rules
- Implementing access control
- Validating user permissions

**Approach:**
1. Match rules to path pattern
2. Validate userId matches request.auth.uid
3. Use collection-level rules

## API Reference

### FirestorePathResolver

Constructor parameters:
- **collectionName**: string - Name of the collection (without path)
- **db**: Firestore | null - Firestore instance

Methods:

#### `getUserCollection(userId: string)`

Get collection reference for a user.

**Returns:** CollectionReference or null

**Use For:**
- Query operations
- Adding documents
- Collection-level reads

**Example Path:** `users/{userId}/{collectionName}`

#### `getDocRef(userId: string, documentId: string)`

Get document reference for a specific item.

**Returns:** DocumentReference or null

**Use For:**
- Document updates
- Document deletes
- Single document reads

**Example Path:** `users/{userId}/{collectionName}/{documentId}`

## Error Handling

### Null Database

**Behavior:** Returns null when db is not initialized.

**Strategy:** Check for null before using references.

**Why:** Graceful degradation when Firebase not ready.

### Invalid Parameters

**Behavior:** Does not validate userId or documentId.

**Strategy:** Validate before calling resolver methods.

**Why:** Performance - avoids double validation

## Common Mistakes to Avoid

1. ❌ Manual path construction
   - ✅ Always use FirestorePathResolver

2. ❌ Root-level collections for user data
   - ✅ Always use `users/{userId}/` pattern

3. ❌ Inconsistent collection names
   - ✅ Use kebab-case for collection names

4. ❌ Not handling null db
   - ✅ Check for null returns

## AI Agent Instructions

### When Creating New Collection

1. Must follow `users/{userId}/{collectionName}` pattern
2. Create resolver instance in repository
3. Document collection purpose
4. Add security rules following pattern
5. Update this README if pattern changes (IT SHOULD NOT)

### When Modifying Path Structure

**WARNING:** Path structure is FROZEN across all apps.

**DO NOT:**
- Change the standard pattern
- Add exceptions to the rule
- Create alternative patterns
- Deviate from `users/{userId}/`

**IF YOU MUST:**
- Get approval from package maintainer
- Update all existing apps
- Migrate all existing data
- Update all documentation
- Breaking version bump required

### When Creating Repositories

1. Accept resolver in constructor
2. Use resolver for all paths
3. Never construct paths manually
4. Document the collection name
5. Follow repository patterns

## Code Quality Standards

### Naming Conventions

- **Collection names**: kebab-case (e.g., `user-posts`, `notification-preferences`)
- **Resolver instances**: `pathResolver` or `collectionPathResolver`
- **User IDs**: Use `userId` parameter name consistently

### TypeScript

- Always type Firestore instance
- Handle null db case
- Use proper return types
- Document nullable returns

## Related Documentation

- [Firestore Module README](../README.md)
- [Repository README](../../infrastructure/repositories/README.md)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security)

## Security Rules Guidance

**Recommended Pattern:**

**Basic Structure:**
- Match pattern: `users/{userId}/{collectionName=**}`
- Validation: Check `request.auth.uid == userId`
- Scope: Apply at users level for all user collections
- Access: Allow read/write for owner only

**Key Points:**
- Always validate userId matches authenticated user
- Use `{collectionName=**}` for wildcard matching
- Apply at users level for all collections
- Never allow cross-user access
- Test security rules thoroughly

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
**IMPORTANT:** Path structure is frozen and must not be changed without major version bump.
