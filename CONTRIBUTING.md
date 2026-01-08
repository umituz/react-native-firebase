# Development Guidelines & AI Instructions

This document outlines the strategies, rules, and guidelines for developing and maintaining `@umituz/react-native-firebase`.

## 📋 For AI Agents & Contributors

When working with this codebase, follow these guidelines:

### Core Principles

1. **Domain-Driven Design (DDD)**: The codebase follows DDD architecture
2. **Clean Architecture**: Clear separation of concerns (Domain, Infrastructure, Presentation)
3. **Type Safety**: Leverage TypeScript for type safety
4. **No Code Examples in Docs**: Documentation should describe usage, not show implementation

### Before Making Changes

1. Read the module-specific README in the target directory
2. Understand the architecture layer you're working in
3. Follow the established patterns in that module
4. Check for existing utilities before creating new ones

### Module Structure

```
src/
├── auth/                    # Authentication Module
│   ├── domain/              # Business logic, entities, errors
│   ├── infrastructure/      # External services, config, data access
│   └── presentation/        # React hooks, UI components
├── firestore/              # Firestore Database Module
│   ├── domain/              # Business logic, entities, errors
│   ├── infrastructure/      # Repositories, middleware, services
│   └── utils/               # Helper functions
├── storage/                # Storage Module
├── domain/                 # Shared domain models
├── infrastructure/          # Core Firebase setup
└── presentation/           # Shared UI components
```

## 🚫 Forbidden Practices

### Architecture Violations

- ❌ **DO NOT** mix architectural layers (e.g., import infrastructure directly from domain)
- ❌ **DO NOT** bypass repositories to access Firestore directly in UI components
- ❌ **DO NOT** use Firebase SDK directly in presentation layer
- ❌ **DO NOT** create circular dependencies between modules
- ❌ **DO NOT** put business logic in UI components

### Code Organization

- ❌ **DO NOT** create files larger than 200 lines (split into smaller modules)
- ❌ **DO NOT** duplicate code (use shared utilities instead)
- ❌ **DO NOT** use `any` type (use proper TypeScript types)
- ❌ **DO NOT** use magic numbers or strings (use constants)

### Anti-Patterns

- ❌ **DO NOT** hardcode configuration values
- ❌ **DO NOT** use console.log for debugging in production
- ❌ **DO NOT** ignore error handling
- ❌ **DO NOT** use Firebase directly without going through service layer

## ✅ Required Practices

### Every Module Must Have

1. **README.md** with:
   - Module purpose and responsibilities
   - Architecture overview
   - Strategies for common scenarios
   - Rules specific to this module
   - Forbidden practices for this module
   - AI agent instructions

2. **Type Definitions**:
   - All functions must have proper TypeScript types
   - Export types used by other modules

3. **Error Handling**:
   - Use domain-specific error classes
   - Never swallow errors silently

### Code Quality Standards

1. **TypeScript Strict Mode**:
   - All files must pass type checking
   - Use `strict: true` in tsconfig.json

2. **Naming Conventions**:
   - Files: `kebab-case.ts` (e.g., `user-repository.ts`)
   - Classes: `PascalCase` (e.g., `UserRepository`)
   - Functions/Variables: `camelCase` (e.g., `getUserById`)
   - Constants: `UPPER_SNAKE_CASE` (e.g., `MAX_RETRIES`)
   - Interfaces/Types: `PascalCase` (e.g., `UserEntity`)

3. **File Organization**:
   - Maximum 200 lines per file
   - One class/export per file when possible
   - Group related functionality in folders

### Error Handling Rules

1. **Use Domain Errors**:
   - Create specific error classes for each domain
   - Extend base error classes (e.g., `FirebaseAuthError`)

2. **Never Throw Primitives**:
   - Always throw Error instances
   - Include error codes for programmatic handling

3. **Log Errors Appropriately**:
   - Use proper logging levels (debug, info, warn, error)
   - Include context information in logs

### Testing Requirements

1. **Unit Tests**:
   - Test all public methods
   - Mock external dependencies
   - Test error scenarios

2. **Integration Tests**:
   - Test repository patterns
   - Test middleware functionality
   - Test state management

## 🤖 AI Agent Instructions

### When Generating Code

1. **Always Check Existing Patterns**:
   - Look for similar functionality in the codebase
   - Follow the existing patterns
   - Don't reinvent the wheel

2. **Respect Architecture**:
   - Place code in correct architectural layer
   - Use dependency injection
   - Follow the established patterns

3. **Check Module README**:
   - Read the README in the target directory first
   - Follow module-specific rules
   - Respect forbidden practices

4. **File Size Limits**:
   - Keep files under 200 lines
   - Split large files into smaller modules
   - Extract reusable logic

### Before Committing

1. Run type checking: `npm run typecheck`
2. Run linting: `npm run lint`
3. Run tests: `npm test`
4. Ensure all README files are updated

### Common Scenarios

#### Adding New Feature

1. Identify the correct module (auth/firestore/storage/infrastructure)
2. Create domain entities in `domain/`
3. Create interfaces in `domain/`
4. Implement in `infrastructure/`
5. Create hooks in `presentation/` if needed
6. Update module README

#### Adding Repository

1. Extend `BaseRepository`, `BaseQueryRepository`, or `BasePaginatedRepository`
2. Place in `firestore/infrastructure/repositories/`
3. Follow repository patterns
4. Update README

#### Adding Hook

1. Place in `auth/presentation/hooks/` or `presentation/`
2. Follow existing hook patterns
3. Use existing hooks as reference
4. Update README

## 📝 Module-Specific Guidelines

### Auth Module

- **Purpose**: Firebase Authentication operations
- **Key Files**: `auth/README.md`
- **Rules**:
  - Never use Firebase Auth directly in UI
  - Always use auth services and hooks
  - Use auth guards for protected routes

### Firestore Module

- **Purpose**: Database operations with repository pattern
- **Key Files**: `firestore/README.md`
- **Rules**:
  - Always use repositories for data access
  - Register middleware for tracking
  - Use pagination for large datasets
  - Track quota usage

### Storage Module

- **Purpose**: File upload and deletion
- **Key Files**: `storage/README.md`
- **Rules**:
  - Always clean up old files
  - Use organized path structures
  - Handle errors gracefully

### Infrastructure Module

- **Purpose**: Core Firebase setup and configuration
- **Key Files**: `infrastructure/README.md`
- **Rules**:
  - Initialize Firebase once at app start
  - Use environment variables for config
  - Never hardcode credentials

## 🔧 Development Workflow

### 1. Setup

```bash
# Install dependencies
npm install

# Run type check
npm run typecheck

# Run lint
npm run lint
```

### 2. Making Changes

1. Read the README in the target directory
2. Understand the architecture and patterns
3. Make changes following the guidelines
4. Update relevant README files
5. Run type checking and linting

### 3. Testing

1. Write unit tests for new functionality
2. Run tests: `npm test`
3. Ensure all tests pass
4. Update test documentation

### 4. Documentation

1. Update module README if behavior changes
2. Document new strategies or rules
3. Update AI instructions if needed
4. Keep documentation in sync with code

## 📚 Documentation Strategy

### Principles

1. **Describe Over Show**: Explain what and why, not just how
2. **Strategy Focused**: Include architectural decisions and strategies
3. **Rules-Based**: Clearly state what's allowed and forbidden
4. **AI-Friendly**: Include instructions for AI agents
5. **Stable Documentation**: Docs should rarely change when code changes

### What to Include

- Module purpose and scope
- Architecture overview
- Key strategies and patterns
- Rules (required practices)
- Forbidden practices
- AI agent instructions
- Type definitions (API reference)

### What to Avoid

- Extensive code examples
- Implementation tutorials
- Step-by-step coding guides
- Copy-paste code snippets

## 🎯 Quality Standards

### Code Must Be

- Type-safe (TypeScript strict mode)
- Under 200 lines per file
- Well-organized in DDD layers
- Properly documented with JSDoc
- Following naming conventions
- Error-handled appropriately
- Tested appropriately

### Documentation Must Be

- In English
- Strategy-focused
- Rules-based
- AI-friendly
- Stable (doesn't need frequent updates)
- Clear about what's forbidden

## 🚨 Breaking Changes

### When to Make

- Major architectural changes
- API changes that affect consumers
- Removal of deprecated features

### Process

1. Update all relevant README files
2. Document breaking changes clearly
3. Provide migration guide
4. Update version number appropriately

## 📞 Getting Help

1. Read module-specific README first
2. Check existing patterns in codebase
3. Follow guidelines in this document
4. Ask questions when unsure

## 🔍 Resources

- [Main README](./README.md)
- [Auth Module](./src/auth/README.md)
- [Firestore Module](./src/firestore/README.md)
- [Storage Module](./src/storage/README.md)
- [Infrastructure](./src/infrastructure/README.md)

---

**Last Updated**: 2025-01-08

**Version**: 1.0.0

**Maintainer**: Ümit UZ <umit@umituz.com>
