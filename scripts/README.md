# Admin Scripts

Firebase Admin utilities for backend operations, user management, data seeding, cleanup, and maintenance tasks.

## Purpose

Provides backend/admin tools for Firebase project management using firebase-admin SDK. Use for data operations, user management, cleanup, testing, and maintenance.

## For AI Agents

### ⚠️ IMPORTANT WARNING

**These scripts are for BACKEND/ADMIN use only, NOT for client applications!**

### Before Using Admin Scripts

1. **UNDERSTAND** these are backend tools, not for client apps
2. **NEVER** use firebase-admin in client applications (security risk)
3. **ALWAYS** test in staging before production
4. **BACKUP** data before destructive operations
5. **USE** confirmations for dangerous operations

### Required Practices

1. **Use only in backend/admin contexts** - NEVER in client apps
2. **Test in staging** before running in production
3. **Backup data** before destructive operations
4. **Use confirmations** for dangerous operations
5. **Monitor progress** for long-running operations
6. **Handle errors** appropriately and log them

### Forbidden Practices

## ❌ NEVER

- Use firebase-admin in client/frontend applications
- Run destructive scripts without testing first
- Skip confirmations for dangerous operations
- Use admin scripts in browser/React Native
- Expose admin credentials in client code
- Delete data without backups

## ⚠️ Avoid

- Running bulk operations during peak hours
- Not monitoring operation progress
- Ignoring errors in batch operations
- Rate limiting issues (add delays between batches)
- Not logging operation results

## 🏗️ Architecture

```
scripts/
├── lib/                      # Core functionality
│   ├── admin/               # Firebase admin initialization
│   ├── auth/                # Authentication admin operations
│   ├── firestore/           # Firestore admin operations
│   ├── storage/             # Storage admin operations
│   ├── credits/             # User credits management
│   └── utils/               # Utility functions
└── index.ts                 # Main entry point and CLI
```

## ✅ Required Practices

### Security Requirements

**Service Account Management:**
1. Store service account key securely (never in repo)
2. Use environment variables for credentials
3. Rotate service account keys regularly
4. Limit service account permissions (principle of least privilege)
5. Never commit service account files to version control

**Client Application Safety:**
- **DO NOT** bundle firebase-admin in client builds
- **DO NOT** expose admin SDK to browser
- **DO NOT** use admin operations from client code
- **DO** use client Firebase SDK for app operations

### Testing Requirements

**Before Production:**
1. Test all scripts in staging environment
2. Verify backup/restore procedures
3. Test with small datasets first
4. Monitor for errors and edge cases
5. Document script behavior and results

### Operational Safety

**For Destructive Operations:**
1. Always require confirmation (skipConfirmation: false by default)
2. Show what will be affected before executing
3. Provide dry-run mode when possible
4. Log all operations for audit trail
5. Keep backups until operation verified successful

## 🎯 Usage Strategies

### For User Management

**Strategy:** Use for user cleanup, analytics, and bulk operations.

**When to Use:**
- Cleaning up inactive/anonymous users
- Generating user analytics reports
- Bulk user updates (with caution)
- Debugging user issues

**Approach:**
1. List users to identify targets
2. Filter by criteria (creation date, activity)
3. Backup affected user data
4. Execute operation with confirmation
5. Verify results and handle errors

**Functions:**
- `listAllUsers()` - List all users
- `listAnonymousUsers()` - List anonymous users only
- `deleteUsers(uids)` - Delete specific users
- `cleanupAnonymousUsers()` - Remove old anonymous users
- `getAuthUserStats()` - Get user statistics

### For Data Seeding

**Strategy:** Use for testing, development, and demo data.

**When to Use:**
- Populating development database
- Creating demo data
- Testing with realistic datasets
- Performance testing

**Approach:**
1. Define data structure
2. Generate or load data
3. Use batch operations for efficiency
4. Handle partial failures
5. Verify seeded data

**Functions:**
- `seedBatch()` - Seed collection with data
- `seedUserSubcollection()` - Seed user-specific data
- `deleteCollection()` - Clean up before seeding

### For Data Cleanup

**Strategy:** Regular maintenance to remove old/unused data.

**When to Use:**
- Removing old anonymous accounts
- Cleaning up test data
- Deleting inactive user data
- Storage cleanup

**Approach:**
1. Identify cleanup criteria (age, activity)
2. List affected data
3. Backup if needed
4. Execute cleanup with confirmations
5. Verify and log results

**Functions:**
- `deleteCollection()` - Delete entire collection
- `deleteUserSubcollection()` - Delete user's data
- `deleteAllData()` - Delete all Firestore data (dangerous!)
- `deleteAllFiles()` - Delete all Storage files
- `cleanupAnonymousUsers()` - Remove anonymous users

### For Credits Management

**Strategy:** Manage user credits and subscriptions.

**When to Use:**
- Adding bonus credits
- Managing subscriptions
- Generating credit reports
- User credit adjustments

**Approach:**
1. Get current user data
2. Verify operation validity
3. Execute credit adjustment
4. Update subscription if needed
5. Log for audit trail

**Functions:**
- `getUserData()` - Get user with credits
- `addUserCredits()` - Add credits to user
- `setUserCredits()` - Set exact credit amount
- `listUsersWithCredits()` - List all users with credits
- `getCreditsSummary()` - Get credit statistics

### For Analytics and Reporting

**Strategy:** Generate insights from Firebase data.

**When to Use:**
- User growth analysis
- Storage usage reports
- Credit distribution analysis
- System health monitoring

**Approach:**
1. Query relevant data
2. Aggregate and calculate statistics
3. Format for readability
4. Export or display results

**Functions:**
- `getAuthUserStats()` - Authentication statistics
- `getFirestoreUserStats()` - User data statistics
- `getStorageStats()` - Storage usage statistics
- `getCreditsSummary()` - Credit distribution

## 🔧 Operation Categories

### Authentication Admin

**User Listing:**
- `listAllUsers(auth)` - All users with metadata
- `listAuthenticatedUsers(auth)` - Only non-anonymous users
- `listAnonymousUsers(auth)` - Only anonymous users
- `getAuthUserStats(auth)` - User statistics

**User Deletion:**
- `deleteUsers(auth, uids)` - Delete specific users
- `cleanupAnonymousUsers(auth)` - Delete anonymous users
- `deleteAllUsers(auth, options?)` - Delete all users (dangerous!)

### Firestore Admin

**Collection Operations:**
- `listCollections(firestore)` - List all collections
- `listUserSubcollections(firestore, uid)` - User's collections
- `countDocuments(firestore, path)` - Count documents
- `getFirestoreUserStats(firestore, uid)` - User statistics

**Data Deletion:**
- `deleteCollection(firestore, name)` - Delete collection
- `deleteUserSubcollection(firestore, uid, name)` - Delete user data
- `deleteAllData(firestore, options?)` - Delete all (dangerous!)

**Data Seeding:**
- `seedBatch(firestore, collection, data)` - Seed collection
- `seedUserSubcollection(firestore, uid, name, data)` - Seed user data

### Storage Admin

**File Operations:**
- `listFiles(storage, prefix?)` - List files
- `deleteAllFiles(storage, onProgress?)` - Delete all files
- `deleteFilesByPrefix(storage, prefix)` - Delete by path
- `deleteUserFiles(storage, uid)` - Delete user's files
- `getStorageStats(storage)` - Storage statistics

### Credits Management

**Credit Operations:**
- `getUserData(firestore, uid)` - Get user with credits
- `initializeUserCredits(firestore, uid, data)` - Initialize credits
- `addUserCredits(firestore, uid, amount)` - Add credits
- `setUserCredits(firestore, uid, amount)` - Set credits
- `deleteUserCredits(firestore, uid)` - Delete credits

**Reporting:**
- `listUsersWithCredits(firestore)` - List users with credits
- `getCreditsSummary(firestore)` - Credit statistics
- `printUserData(data)` - Pretty print user data

## 🤖 AI Agent Instructions

### When Creating Admin Scripts

1. **Always use firebase-admin**, not client Firebase SDK
2. **Add confirmations** for destructive operations
3. **Implement progress tracking** for long operations
4. **Handle errors** gracefully and log them
5. **Provide dry-run mode** when possible
6. **Document script behavior** clearly
7. **Include examples** in README

### When Running Bulk Operations

1. Test with small dataset first
2. Add delays between batches to avoid rate limits
3. Monitor progress and handle errors
4. Keep partial failure handling
5. Log all operations
6. Verify results after completion

### When Adding New Operations

1. Check if similar operation exists
2. Follow existing patterns
3. Add proper TypeScript types
4. Include error handling
5. Document in this README
6. Add examples for common use cases

## 📏 Code Quality Standards

### File Size

- **Maximum:** 200 lines per file
- **Strategy:** Split large operations into modules
- **Current:** Organized by category (auth, firestore, storage, credits)

### TypeScript

- Use strict mode
- Define proper types for all functions
- Export types used by external scripts
- Never use `any` type
- Document complex types

### Error Handling

1. Always try-catch admin operations
2. Handle Firebase Admin errors
3. Provide clear error messages
4. Log errors for debugging
5. Implement partial failure handling for batches

### Naming Conventions

- Files: `kebab-case.ts`
- Functions: `camelCase`
- Interfaces/Types: `PascalCase`
- CLI commands: `kebab-case`

## 🚨 Common Mistakes to Avoid

1. ❌ Using admin SDK in client applications
   - ✅ Only use in backend/admin scripts

2. ❌ Skipping confirmation for dangerous operations
   - ✅ Always require confirmation (default behavior)

3. ❌ Not testing before production
   - ✅ Test in staging first

4. ❌ No backups before destructive operations
   - ✅ Always backup before deleting data

5. ❌ Not monitoring long-running operations
   - ✅ Use progress callbacks

6. ❌ Ignoring errors in batch operations
   - ✅ Handle and log all errors

## 🔐 Security Considerations

### Service Account Management

**Best Practices:**
1. Store service account key in secure location
2. Use environment variables (never hardcode)
3. Set appropriate file permissions (chmod 600)
4. Use different service accounts for different environments
5. Rotate keys regularly
6. Revoke compromised keys immediately

**Environment Variables:**
Set these environment variables before running scripts:
- `FIREBASE_SERVICE_ACCOUNT_PATH` - Path to service account JSON file
- `FIREBASE_PROJECT_ID` - Your Firebase project ID
- `FIREBASE_STORAGE_BUCKET` - Your Firebase Storage bucket name

### Principle of Least Privilege

**Service Account Permissions:**
- Only grant necessary permissions
- Use custom roles instead of primitive roles
- Separate service accounts for different tasks
- Regular audit of permissions

**Examples:**
- Data seeding script: Firestore write only
- Cleanup script: Firestore delete only
- Analytics script: Firestore read only

### Client Application Safety

**CRITICAL Security Examples:**

**❌ WRONG - Never do this:**
- Import firebase-admin in client applications
- Bundle service account keys in client builds
- Expose admin SDK to browser/React Native
- Use admin operations from client code

**✅ CORRECT Approach:**
- Admin scripts: Run in Node.js backend/CLI only
- Client apps: Use `firebase` client SDK (not firebase-admin)
- API layer: Create backend API if admin operations needed from client
- Service accounts: Store securely, never in client code

## 📊 Performance Considerations

### Batch Operations

**Strategy:**
- Use batch writes (max 500 operations per batch)
- Add delays between batches (avoid rate limits)
- Monitor memory usage
- Process in chunks for large datasets

**Example Pattern:**
1. Split data into chunks of 500
2. Process each chunk with batch
3. Wait 1 second between batches
4. Track progress
5. Handle partial failures

### Rate Limiting

**Firebase Limits:**
- Writes: 1 per document per second
- Batch writes: 500 operations max
- List operations: Rate limited after large lists

**Mitigation:**
- Add delays between operations
- Use batch operations when possible
- Implement exponential backoff for retries
- Monitor for rate limit errors

## 📚 Related Documentation

- [Development Guidelines](../CONTRIBUTING.md)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Security](https://firebase.google.com/docs/security)

## 🔗 API Reference

### Initialization

| Function | Description | Usage |
|----------|-------------|-------|
| `initFirebaseAdmin(config)` | Initialize Admin SDK | Backend scripts only |
| `getAuthAdmin(app)` | Get Auth instance | Auth operations |
| `getFirestoreAdmin(app)` | Get Firestore instance | Database operations |
| `getStorageAdmin(app)` | Get Storage instance | File operations |
| `resetFirebaseAdmin()` | Reset instances | Testing only |

### Main Export Categories

- **Auth Operations** - User management and cleanup
- **Firestore Operations** - Database operations
- **Storage Operations** - File management
- **Credits Management** - User credits and subscriptions
- **Utilities** - Helper functions

## 🎓 Key Concepts

### Why Separate Admin SDK?

**Client SDK (`firebase`):**
- For React Native/web applications
- User-scoped operations
- Security rules enforced
- Limited permissions

**Admin SDK (`firebase-admin`):**
- For backend/Node.js only
- Full access bypassing security rules
- Service account authentication
- Complete permissions

**Why This Separation?**
- Security: Prevent privilege escalation
- Performance: Bypass security rules for bulk ops
- Safety: Client SDK limits dangerous operations
- Architecture: Clear separation of concerns

### Why Confirmations Required?

**Dangerous Operations:**
- Delete all users
- Delete all data
- Delete all files
- Bulk updates

**Confirmation Strategy:**
1. Default: require explicit confirmation
2. Show what will be affected
3. Require `skipConfirmation: true` after understanding
4. Provide dry-run mode when possible
5. Log all destructive operations

### Why Backup Before Operations?

**Data Loss Risks:**
- Accidental deletion
- Script bugs
- Misunderstanding of operation scope
- Unexpected side effects

**Backup Strategy:**
1. Export Firestore data before bulk operations
2. Keep backups until operation verified
3. Test restore procedures
4. Document backup locations
5. Set retention policy for backups

---

**Last Updated:** 2025-01-08
**Maintainer:** Admin Scripts Team
**IMPORTANT:** These scripts are for backend/admin use only, never for client applications.
