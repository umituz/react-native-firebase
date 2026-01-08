# Document Mapper

Utility for transforming Firestore documents to domain entities and vice versa.

## Purpose

Provides bidirectional mapping between Firestore document structures and application domain entities, enabling clean separation between database schema and application models.

## For AI Agents

### Before Using Document Mapper

1. **DEFINE** both document and entity interfaces
2. **USE** short field names in Firestore documents (saves storage)
3. **USE** descriptive names in entities (better code readability)
4. **CREATE** one mapper per entity type
5. **USE** mapper for all conversions (never manual mapping)

### Required Practices

1. **Always use mappers** for document-entity conversions
2. **Keep Firestore schema minimal** (short field names)
3. **Use descriptive names** in entity interfaces
4. **Create one mapper per entity** (not generic mappers)
5. **Use type-safe mapping** (never use `any`)

### Forbidden Practices

## ❌ NEVER

- Use Firestore documents directly in application code
- Use entity objects directly in Firestore operations
- Create generic mappers (loses type safety)
- Mix document and entity types
- Manual field-by-field mapping
- Use `any` type for mappers

## ⚠️ Avoid

- Complex transformation logic in mappers (keep simple)
- Nested field mappings (flatten structure)
- Business logic in mappers (only mapping)
- Inconsistent naming conventions

## Usage Strategies

### For User Entities

**Strategy:** Map between short Firestore fields and descriptive entity fields.

**Firestore Document Schema:**
- Use short field names to reduce storage
- Example: `nm` instead of `name`, `em` instead of `email`
- Store dates as ISO strings
- Use consistent naming

**Entity Schema:**
- Use descriptive field names
- Example: `name`, `email`, `createdAt`
- Use Date objects for dates
- Follow TypeScript conventions

**Mapper Configuration:**
- Import from: `src/firestore/utils/document-mapper.helper`
- Use: `createDocumentMapper<DocumentType, EntityType>()`
- Define field mappings in config object
- One mapper per entity type

### For Product Entities

**Strategy:** Separate product document schema from application model.

**When to Use:**
- E-commerce applications
- Product catalogs
- Inventory management

**Document Fields (Firestore):**
- Short names: `n` (name), `d` (description), `p` (price)
- Categories: `cat`, `st` (stock), `imgs` (images)

**Entity Fields (Application):**
- Descriptive: `name`, `description`, `price`
- Full names: `category`, `stock`, `images`

**Benefits:**
- Reduced Firestore storage costs
- Better code readability
- Type-safe conversions
- Easy to modify schema

### For Multiple Views

**Strategy:** Create different mappers for different use cases.

**Mapper Types:**
- **Full Mapper** - Complete entity with all fields
- **Summary Mapper** - Minimal fields for lists
- **Public Mapper** - Only public-safe fields
- **Admin Mapper** - All fields including sensitive data

**When to Use:**
- Different UI views need different data
- Public vs private data access
- Performance optimization (smaller payloads)
- Security (hide sensitive fields)

**Implementation:**
- Create separate mapper instances
- Name them descriptively (e.g., `userFullMapper`, `userSummaryMapper`)
- Use appropriate mapper for each context
- Document mapper purpose

### For Custom Transformations

**Strategy:** Create custom mapper class for complex transformations.

**When to Use:**
- Need validation logic
- Need data formatting
- Need computed fields
- Need type conversions beyond simple renaming

**Custom Mapper Pattern:**
- Create class with `toEntity()` and `toDocument()` methods
- Implement transformation logic
- Handle null/undefined cases
- Add validation if needed
- Keep methods focused

## Configuration Options

### DocumentMapperConfig

**Import from:** `src/firestore/utils/document-mapper.helper`

**Required Fields:**
- `id` - ID field name in document (usually 'id')
- `fields` - Object mapping entity fields to document fields

**Field Mapping Format:**
- Key: Entity field name (descriptive)
- Value: Document field name (short)

**Example Strategy:**
- Entity field `email` → Document field `em`
- Entity field `createdAt` → Document field `cr_at`
- Entity field `phoneNumber` → Document field `ph`

### Type Safety

**Generic Types:**
- `Document` - Firestore document interface
- `Entity` - Application entity interface
- Both required for type safety

**TypeScript Benefits:**
- Autocomplete for field names
- Compile-time type checking
- Refactoring support
- No runtime type errors

## Field Naming Strategies

### Firestore Document Names

**Strategy:** Use short, abbreviated names.

**Guidelines:**
- Max 5-10 characters per field
- Remove vowels from common words
- Use consistent abbreviations
- Document abbreviations in comments

**Common Abbreviations:**
- `nm` - name
- `em` - email
- `ph` - phone
- `addr` - address
- `cr_at` - created_at
- `up_at` - updated_at
- `img` - image

### Entity Field Names

**Strategy:** Use descriptive, full names.

**Guidelines:**
- Use complete words
- Follow TypeScript conventions
- camelCase for multi-word names
- Clear and self-documenting

**Examples:**
- `firstName` (not `fn`)
- `emailAddress` (not `em`)
- `phoneNumber` (not `ph`)
- `profilePictureUrl` (not `img`)

## Common Mistakes to Avoid

1. ❌ Using Firestore documents directly in UI code
   - ✅ Always map to entities first

2. ❌ Not creating separate document interfaces
   - ✅ Define both Document and Entity types

3. ❌ Long field names in Firestore
   - ✅ Use short abbreviations in documents

4. ❌ Manual field mapping
   - ✅ Always use DocumentMapper

5. ❌ One mapper for all entities
   - ✅ Create one mapper per entity type

6. ❌ Complex transformation logic
   - ✅ Keep mappers simple, use custom classes for complex logic

## AI Agent Instructions

### When Creating New Mapper

1. Define Document interface (Firestore schema)
2. Define Entity interface (application model)
3. Use `createDocumentMapper<Document, Entity>()`
4. Map entity fields to document fields
5. Export mapper instance
6. Document field abbreviations

### When Modifying Schema

1. Update Document or Entity interface
2. Update mapper configuration
3. No need to update mapping logic
4. TypeScript will show compilation errors if incomplete
5. Update this README if pattern changes

### For Repository Integration

1. Create mapper in repository file
2. Use in repository methods
3. Map documents to entities when reading
4. Map entities to documents when writing
5. Never expose document types outside repository

## Code Quality Standards

### TypeScript

- Always specify generic types `<Document, Entity>`
- Never use `any` type
- Export both Document and Entity interfaces
- Use strict type checking

### File Organization

- One mapper per file (or per entity)
- Place near entity definition
- Export mapper instance
- Document field mappings

### Testing

- Test both directions (toEntity, toDocument)
- Test edge cases (null, undefined)
- Test type safety
- Verify all fields mapped correctly

## Performance Considerations

### Mapping Overhead

- Minimal performance impact
- Type checking at compile time (not runtime)
- No runtime cost for generics
- Acceptable for all use cases

### Storage Savings

**Example Calculation:**
- Field `email` vs `em`: 2 bytes saved per document
- 100,000 users: 200,000 bytes saved
- Cumulative savings across all fields significant

**Recommendation:** Always use short field names in Firestore

## Related Documentation

- [Firestore Module README](../../README.md)
- [Repository README](../../infrastructure/repositories/README.md)
- [Type Definitions README](../../types/pagination/README.md)

## API Reference

### Main Export

**Function:** `createDocumentMapper<Document, Entity>(config)`

**Returns:** DocumentMapper instance with methods:
- `toEntity(document)` - Convert document to entity
- `toDocument(entity)` - Convert entity to document

**Import From:** `src/firestore/utils/document-mapper.helper`

---

**Last Updated:** 2025-01-08
**Maintainer:** Firestore Module Team
