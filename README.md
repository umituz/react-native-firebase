# @umituz/react-native-firebase

[![npm version](https://badge.fury.io/js/%40umituz%2Freact-native-firebase.svg)](https://www.npmjs.com/package/%40umituz%2Freact-native-firebase)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Comprehensive Firebase package for React Native applications using Firebase JS SDK (no native modules required). Built with Domain-Driven Design (DDD) architecture.

## 🚀 Quick Start

**Read First:** Before using this package, read the [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines and AI instructions.

### Installation

```bash
npm install @umituz/react-native-firebase firebase

# Required peer dependencies
npm install expo-apple-authentication expo-crypto @umituz/react-native-storage
```

### Basic Usage Strategy

1. **Initialize Firebase** once at app startup
2. **Use hooks** for authentication state
3. **Use repositories** for database operations
4. **Follow module-specific guidelines** in each README

## 📦 Modules

### Auth Module
**Location:** [src/auth/README.md](./src/auth/README.md)

Provides authentication functionality:
- Anonymous, Google, Apple, Email/Password authentication
- Auth state management with React hooks
- Account deletion and reauthentication
- Auth guards for protected routes

**Key Strategy:** Never use Firebase Auth SDK directly in UI. Always use the provided hooks and services.

### Firestore Module
**Location:** [src/firestore/README.md](./src/firestore/README.md)

Database operations with repository pattern:
- Base, Query, and Paginated repositories
- Quota management and tracking
- Middleware for caching and monitoring
- Request logging and analytics

**Key Strategy:** Always access Firestore through repositories. Never bypass the repository layer.

### Storage Module
**Location:** [src/storage/README.md](./src/storage/README.md)

File storage operations:
- Base64 and file uploads
- Single and batch deletion
- Metadata management

**Key Strategy:** Always clean up old files. Use organized path structures.

### Admin Scripts
**Location:** [scripts/README.md](./scripts/README.md)

Backend utilities:
- User management and cleanup
- Firestore collection operations
- Storage file management

**Key Strategy:** Use for admin operations, not in client apps.

## 🏗️ Architecture

This package follows **Domain-Driven Design (DDD)** principles.

### Layer Structure

```
├── domain/              # Business logic (entities, errors, value objects)
├── infrastructure/      # External dependencies (Firebase, APIs)
└── presentation/        # UI integration (React hooks, components)
```

### Key Design Patterns

- **Repository Pattern** - Data access through repository abstractions
- **Middleware Pattern** - Cross-cutting concerns (logging, caching)
- **Service Layer** - Business logic encapsulation
- **Factory Pattern** - Object creation and initialization

## ✅ Required Practices

### For All Modules

1. **Type Safety:** Use TypeScript strict mode
2. **Error Handling:** Handle all errors appropriately
3. **Documentation:** Keep README files in sync with code
4. **Testing:** Write tests for new functionality
5. **File Size:** Keep files under 200 lines

### For Authentication

1. Use hooks (never Firebase SDK directly in UI)
2. Protect routes with auth guards
3. Handle auth state changes properly
4. Clean up auth listeners on unmount

### For Firestore

1. Always use repositories for data access
2. Use pagination for large datasets
3. Track quota usage with middleware
4. Create appropriate indexes in Firebase Console
5. Use query builders for complex queries

### For Storage

1. Clean up old files before uploading new ones
2. Use organized path structures
3. Add metadata to files for tracking
4. Handle deletion errors gracefully

## 🚫 Forbidden Practices

### Architecture Violations

- ❌ Mixing architectural layers (e.g., infrastructure importing from domain)
- ❌ Bypassing repositories to access Firestore directly
- ❌ Using Firebase SDK directly in UI components
- ❌ Creating circular dependencies between modules
- ❌ Putting business logic in presentation layer

### Code Quality Issues

- ❌ Files larger than 200 lines
- ❌ Duplicated code
- ❌ Using `any` type
- ❌ Magic numbers or strings (use constants)
- ❌ Hardcoded configuration values

### Anti-Patterns

- ❌ Hardcoded credentials or API keys
- ❌ Console.log in production code
- ❌ Swallowing errors silently
- ❌ Ignoring TypeScript errors

## 🤖 For AI Agents

### When Writing Code

1. **READ** the module-specific README first
2. **FOLLOW** existing patterns in the codebase
3. **RESPECT** architectural boundaries
4. **CHECK** file size limits (max 200 lines)
5. **USE** established utilities and services

### Before Generating Code

1. Search for similar existing functionality
2. Check if a utility already exists
3. Read the relevant module README
4. Understand the architectural layer

### Code Generation Rules

1. Keep files under 200 lines
2. Follow TypeScript strict mode
3. Use proper naming conventions
4. Handle all errors
5. Add JSDoc comments for public APIs

## 📚 Documentation

- **[Development Guidelines](./CONTRIBUTING.md)** - Must read before contributing
- **[Auth Module](./src/auth/README.md)** - Authentication strategies and rules
- **[Firestore Module](./src/firestore/README.md)** - Database operations and patterns
- **[Storage Module](./src/storage/README.md)** - File storage guidelines
- **[Infrastructure](./src/infrastructure/README.md)** - Core setup and configuration

## 🎯 Usage Strategies

### Authentication Strategy

1. Initialize Firebase once at app startup
2. Use `useFirebaseAuth` hook for auth state
3. Use specific auth hooks for different providers
4. Protect routes with auth guards
5. Handle auth errors with user-friendly messages

### Database Strategy

1. Create repositories extending base repository classes
2. Use pagination for large datasets
3. Register middleware for quota tracking
4. Use query builders for complex queries
5. Monitor quota usage regularly

### File Storage Strategy

1. Use organized path structures (e.g., `users/{userId}/avatar.jpg`)
2. Delete old files before uploading new ones
3. Add metadata for tracking
4. Handle upload/deletion errors appropriately

## 🔧 Environment Setup

### Required Environment Variables

```bash
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
```

### Firebase Console Setup

1. Create Firebase project
2. Enable required services (Auth, Firestore, Storage)
3. Configure authentication providers
4. Set security rules for Firestore and Storage

## 📋 Module Documentation

Each module has comprehensive documentation including:
- Purpose and responsibilities
- Architecture overview
- Usage strategies
- Required practices
- Forbidden practices
- AI agent instructions

**Read the module-specific README before working on that module.**

## 🛠️ Development

### Type Checking

```bash
npm run typecheck
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build:scripts
```

## 📝 Contributing

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md)
2. Read module-specific README
3. Follow architectural patterns
4. Keep files under 200 lines
5. Update documentation if behavior changes
6. Ensure all tests pass

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 🆘 Support

- **Issues:** [GitHub Issues](https://github.com/umituz/react-native-firebase/issues)
- **Email:** umit@umituz.com

---

**Last Updated:** 2025-01-08
**Version:** 1.13.58
**Maintainer:** Ümit UZ <umit@umituz.com>
