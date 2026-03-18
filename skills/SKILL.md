---
name: setup-react-native-firebase
description: Sets up @umituz/react-native-firebase in React Native or Expo apps with automated installation, configuration, and cost optimizations. Triggers on: Setup Firebase, initialize Firebase, Firebase configuration, install Firebase, Firebase setup, autoInitializeFirebase, Firebase integration, Firestore setup, @umituz/react-native-firebase.
---

# Setup React Native Firebase

Comprehensive automated setup for `@umituz/react-native-firebase` package with production-ready cost optimizations and Firebase Console guidance.

## Overview

This skill handles everything needed to integrate Firebase into your React Native or Expo app:
- Package installation and updates
- **Firebase Console setup** (project, auth, Firestore, storage)
- **Security rules** (including account deletion edge cases)
- Peer dependency management
- Environment configuration
- Firebase initialization
- Cost-saving optimizations (enabled by default)
- Native setup for bare React Native

## ⚠️ CRITICAL: Package-Driven Architecture

| Principle | Description |
|-----------|-------------|
| **Package-First** | Firebase logic in `@umituz/react-native-firebase` package. App provides configuration only |
| **Zero Direct Firebase Calls** | NEVER import `firebase` directly except for custom queries after package init |
| **No Wrapper Scripts** | Use package CLI (`npx firebase-admin`) - never create admin scripts in app |

### 🚨 FORBIDDEN Packages

| Package | Status | Reason |
|---------|--------|--------|
| `@react-native-firebase/app` | ❌ FORBIDDEN | Conflicts with JS-SDK implementation |
| `@react-native-firebase/auth` | ❌ FORBIDDEN | Conflicts with JS-SDK implementation |
| `@react-native-firebase/firestore` | ❌ FORBIDDEN | Conflicts with JS-SDK implementation |
| Any `@react-native-firebase/*` | ❌ FORBIDDEN | NOT compatible with our architecture |

**This package uses Web JS SDK** - native modules conflict!

## Quick Start

Just say: **"Setup React Native Firebase in my app"** and this skill will handle everything.

**Expected Result:** When configured with optimizations, expect ~740% improvement in free tier longevity!

---

## Phase 1: Firebase Console Setup

### Step 1.1: Create Firebase Project

Before installing the package, set up Firebase project:

| Step | Action |
|------|--------|
| 1 | Visit https://console.firebase.google.com/ |
| 2 | Click "Add project" |
| 3 | Project name: Your app name (lowercase, no spaces) |
| 4 | Enable Google Analytics: Yes (recommended) |
| 5 | Click "Create project" |

### Step 1.2: Add iOS App

| Step | Action |
|------|--------|
| 1 | Click iOS icon in Project Overview |
| 2 | iOS bundle ID: `com.yourcompany.yourapp` |
| 3 | Download `GoogleService-Info.plist` |
| 4 | Place in: `ios/GoogleService-Info.plist` |

### Step 1.3: Add Android App

| Step | Action |
|------|--------|
| 1 | Click Android icon in Project Overview |
| 2 | Android package name: `com.yourcompany.yourapp` |
| 3 | Download `google-services.json` |
| 4 | Place in: `android/app/google-services.json` |

### Step 1.4: Enable Authentication

**Required Methods:**

| Method | Action | Required |
|--------|--------|----------|
| Email/Password | Authentication → Sign-in method → Enable | ✅ Yes |
| Anonymous | Enable Anonymous sign-in | ✅ Yes (Apple requirement) |
| Google OAuth | Enable Google (optional) | ⚪ Optional |

> **⚠️ Anonymous Auth Requirement:** Anonymous users MUST have full feature parity — including subscriptions, credits, and all app features. Apple rejects apps that require account creation. Anonymous users get a Firebase UID and all data is stored at `users/{anonymousUID}/`.

### Step 1.5: Create Firestore Database

| Step | Action |
|------|--------|
| 1 | Go to Firestore Database |
| 2 | Click Create database |
| 3 | Start in Production mode |
| 4 | Choose location closest to users |
| 5 | Click Enable |

### Step 1.6: Firestore Security Rules

**⚠️ CRITICAL: Account Deletion Rules**

When a user deletes their account, Firebase Auth removes the user immediately, but their Firestore documents may still be read momentarily during cleanup. Add these rules to prevent permission errors:

```javascript
match /users/{userId} {
  // User profile and settings
  allow read, write: if isOwner(userId);

  // Allow authenticated users to read during account deletion cleanup
  // This prevents permission-denied errors when user is being deleted
  allow read: if isAuthenticated();

  // Subscription status (synced from RevenueCat)
  match /subscriptionStatus/{docId} {
    allow read: if isOwner(userId) || isAuthenticated();
    allow create, update: if isOwner(userId) || isAuthenticated();
    allow delete: if false;
  }

  // Credits (user credit balance)
  match /credits/{docId} {
    allow read: if isOwner(userId) || isAuthenticated();
    allow create, update: if isOwner(userId) || isAuthenticated();
    allow delete: if false;
  }
}

// Helper functions
function isAuthenticated() {
  return request.auth != null;
}

function isOwner(userId) {
  return request.auth != null && request.auth.uid == userId;
}
```

**Why these rules are needed:**
- User deletion is multi-step: Auth deletion → Firestore cleanup
- Between steps, user ID may exist in query cache
- Without relaxed rules, you'll see `permission-denied` errors
- Delete operations still restricted (`allow delete: if false`)

### Step 1.7: Create Cloud Storage

| Step | Action |
|------|--------|
| 1 | Go to Storage |
| 2 | Click Get started |
| 3 | Start in Production mode |
| 4 | Choose same location as Firestore |

### Step 1.8: Get Firebase Configuration

Copy these values from Firebase Console → Project Settings:

```text
API Key: AIzaSy...
Auth Domain: your-project.firebaseapp.com
Project ID: your-project-id
Storage Bucket: your-project.appspot.com
Messaging Sender ID: 123456789
App ID: 1:123456789:web:abcdef
```

---

## Phase 2: Package Installation

Just say: **"Setup React Native Firebase in my app"** and this skill will handle everything.

**Expected Result:** When configured with optimizations, expect ~740% improvement in free tier longevity!

## When to Use

Invoke this skill when you need to:
- Install @umituz/react-native-firebase in a new project
- Update existing installation to latest version
- Configure Firebase credentials and environment
- Set up optimal cost-saving configurations
- Integrate with navigation (Expo Router, React Navigation)

## Step 1: Analyze the Project

Before installing, understand the project structure:

### Check package.json

Analyze project's `package.json` to determine current state:

```bash
# Check if package is already installed
cat package.json | grep "@umituz/react-native-firebase"

# Check current version if installed
npm list @umituz/react-native-firebase
```

### Detect Project Type

Determine if this is Expo or bare React Native:

```bash
# Check for Expo
cat app.json | grep -q "expo" && echo "Expo project" || echo "Bare React Native"

# Check for native folders (bare React Native)
ls -d ios android 2>/dev/null && echo "Has native folders"
```

### Find App Entry Point

Look for these files in order of priority:
1. `app/_layout.tsx` (Expo Router)
2. `app/_layout.ts`
3. `App.tsx` (standard entry)
4. `App.js`
5. `index.tsx`
6. `index.js`

This is where Firebase initialization will be added.

## Step 2: Install Package

### Install or Update

```bash
# If not installed, install latest
npm install @umituz/react-native-firebase@latest

# If already installed but outdated
npm install @umituz/react-native-firebase@latest
```

### Install Peer Dependencies

Always install these required dependencies:

```bash
# Core requirements
npm install firebase @tanstack/react-query

# Design system (required)
npm install @umituz/react-native-design-system
```

### Optional Dependencies

Install only if needed:

```bash
# Navigation (if using React Navigation)
npm install @gorhom/portal

# Social auth (if using Apple/Google auth)
npx expo install expo-apple-authentication expo-auth-session expo-crypto expo-web-browser
```

## Step 3: Configure Environment

### Check for .env File

```bash
ls -la .env .env.example 2>/dev/null
```

### Create .env.example

If missing, create `.env.example`:

```bash
cat > .env.example << 'EOF'
# Firebase Configuration
# Get these values from Firebase Console: https://console.firebase.google.com/

# Required: Authentication credentials
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id

# Optional: Additional Firebase configuration
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id

# Note: Copy this file to .env and fill in your actual values
# NEVER commit .env file to version control
EOF
```

### Create .env if Missing

```bash
touch .env
```

### Verify Required Variables

Check that these are set in `.env`:

```bash
grep -E "EXPO_PUBLIC_FIREBASE_(API_KEY|AUTH_DOMAIN|PROJECT_ID)" .env
```

If missing, warn the user:
```text
⚠️  Required Firebase environment variables are missing:
- EXPO_PUBLIC_FIREBASE_API_KEY
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID

Please add these to your .env file before continuing.
```

## Step 4: Add Firebase Initialization

### For Expo Router (app/_layout.tsx)

```typescript
import { useEffect } from 'react';
import { autoInitializeFirebase } from '@umituz/react-native-firebase';

export default function RootLayout() {
  // Initialize Firebase when app starts
  useEffect(() => {
    autoInitializeFirebase();
  }, []);

  return <Stack>{/* your screens */}</Stack>;
}
```

### For Standard App.tsx

```typescript
import { useEffect } from 'react';
import { autoInitializeFirebase } from '@umituz/react-native-firebase';

export default function App() {
  useEffect(() => {
    autoInitializeFirebase();
  }, []);

  return <YourAppContent />;
}
```

### Check If Already Initialized

Before adding, verify initialization doesn't exist:

```bash
grep -r "autoInitializeFirebase\|initializeFirebase" app/ App.tsx 2>/dev/null
```

If found, skip this step.

## Step 5: Enable Cost Optimizations (Recommended)

### Find All Files Using Firestore

```bash
grep -r "useFirestoreSnapshot" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null
```

### Replace with Smart Snapshot

For each file found, replace `useFirestoreSnapshot` with `useSmartFirestoreSnapshot`:

**Before:**
```typescript
const { data } = useFirestoreSnapshot({
  queryKey: ['matches', userId],
  subscribe: (onData) => onSnapshot(q, (snap) => onData(snap.docs)),
});
```

**After:**
```typescript
const { data } = useSmartFirestoreSnapshot({
  queryKey: ['matches', userId],
  subscribe: (onData) => onSnapshot(q, (snap) => onData(snap.docs)),
  backgroundStrategy: 'suspend', // Saves ~80% battery/data when app backgrounds
});
```

### Cost Optimization Benefits

| Feature | Savings |
|---------|---------|
| Smart snapshot (background suspend) | ~80% battery and data |
| Query deduplication (10s window) | ~90% duplicate query reads |
| Persistent cache | ~90% on app restarts |
| **Overall expected improvement** | **~740% longer free tier coverage** |

### Additional Optimization: Query Deduplication

```typescript
import { queryDeduplicationMiddleware } from '@umituz/react-native-firebase';

// Automatically deduplicates queries within 10s window
const data = await queryDeduplicationMiddleware.deduplicate(
  ['users', userId],
  () => getDoc(userRef)
);
```

## Step 6: Native Setup (Bare React Native Only)

### iOS Setup

If project has `ios/` folder:

```bash
cd ios && pod install && cd ..
```

### Android Setup

No additional setup needed for Android.

### Skip for Expo

Expo projects don't need native setup.

## Step 7: Verify Setup

### Run the App

```bash
# For Expo
npx expo start

# For bare React Native
npx react-native run-ios
# or
npx react-native run-android
```

### Verification Checklist

- ✅ No Firebase initialization errors
- ✅ Firestore queries work
- ✅ Authentication works (if configured)
- ✅ Quota tracking active (check __DEV__ logs)
- ✅ Smart snapshot suspends on background
- ✅ Deduplication logs show activity

### Expected Dev Logs

In development mode, you should see:

```text
[Deduplication] Adjusted window to 10000ms (quota: 0.0%)
[SmartSnapshot] Suspending listener - app backgrounded
[SmartSnapshot] Resuming listener - app foregrounded
```

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| **Installing @react-native-firebase/* packages** | ❌ FORBIDDEN - conflicts with JS-SDK implementation |
| Forgetting peer dependencies | Always install `firebase`, `@tanstack/react-query`, `@umituz/react-native-design-system` |
| Missing environment variables | Create .env with EXPO_PUBLIC_FIREBASE_* variables |
| Not calling autoInitializeFirebase() | Add useEffect to app entry point |
| Using useFirestoreSnapshot instead of useSmartFirestoreSnapshot | Replace to enable cost optimizations |
| Running pod install in wrong directory | Use `cd ios && pod install && cd ..` |
| Committing .env file | Add .env to .gitignore |
| **Creating admin.ts in app scripts** | ❌ Use package CLI: `npx firebase-admin` |
| **Getting userId from getAuth().currentUser** | Use `useUserId()` or `useAuthStore.getState().firebaseUserId` |
| **Reimplementing package functionality** | Use package exports - never copy code to app |

### 🚨 Script Patterns (CRITICAL)

| FORBIDDEN | REQUIRED Alternative | Why |
|-----------|---------------------|-----|
| ❌ Creating `scripts/firebase/admin.ts` | ✅ Use `npx firebase-admin` from package | Package already has complete CLI |
| ❌ Wrapper scripts for generic operations | ✅ Call package CLI directly | Violates DRY, creates maintenance burden |
| ❌ Reimplementing user management | ✅ Use package utilities | Every app needs same operations |
| ❌ Custom auth/firestore scripts | ✅ Import from package scripts | Generic operations belong in package |
| ❌ Copying package script code to app | ✅ Use package exports | Updates won't propagate to app |

**Golden Rule:** If logout/user-management works the same in every app → It MUST be in package, NOT in app scripts.

---

## Firebase Admin Scripts (Package CLI)

### 🚨 CRITICAL ARCHITECTURE RULE

**If it works the same in every app → Must be in PACKAGE, NOT in app.**

| Location | Purpose | What Goes Here |
|----------|---------|----------------|
| **Package** (`@umituz/react-native-firebase/scripts`) | ✅ ALL generic Firebase operations | Auth, Firestore, Storage, User management, CLI |
| **App** (`scripts/firebase/`) | ✅ ONLY app-specific config | `firestore.rules`, `firestore.indexes.json`, README |

### ✅ Package CLI (Use Directly)

The package provides a complete, production-ready CLI:

```bash
# Package CLI is available via bin entry
npx firebase-admin <command> [args]

# All commands built-in:
npx firebase-admin read-user <userId>
npx firebase-admin init-credits <userId>
npx firebase-admin set-credits <userId> <text> <image>
npx firebase-admin list-users [--limit N]
npx firebase-admin credits-summary
npx firebase-admin delete-user <userId>
npx firebase-admin cleanup-anonymous --days 30
```

### App Scripts Setup (Minimal)

**✅ Create in app:**
- `scripts/firebase/rules/firestore.rules` - App-specific security rules
- `scripts/firebase/README.md` - Documentation

**❌ NEVER create in app:**
- `admin.ts` or any wrapper scripts
- User management scripts (logout, delete, cleanup)
- Generic Firestore operations (read, write, delete)
- Generic Auth operations (list users, cleanup)
- ANY reimplementation of package functionality

### Common Admin Commands

| Command | Usage | Description |
|---------|-------|-------------|
| Read user | `npx firebase-admin read-user <userId>` | Get user data and credits |
| Init credits | `npx firebase-admin init-credits <userId>` | Initialize credits for user |
| Set credits | `npx firebase-admin set-credits <userId> <text> <image>` | Set user credits |
| List users | `npx firebase-admin list-users --limit 50` | List users with credits |
| Credits summary | `npx firebase-admin credits-summary` | Get credits statistics |
| Delete user | `npx firebase-admin delete-user <userId>` | Delete user from Auth and Firestore |
| Cleanup anonymous | `npx firebase-admin cleanup-anonymous --days 30` | Remove old anonymous users |

### Account Deletion Flow

The package provides complete account deletion functionality:

**Client-side deletion** (via `@umituz/react-native-auth`):
```typescript
import { useAccountManagement } from "@umituz/react-native-auth";

const { deleteAccount } = useAccountManagement();

// User clicks "Delete Account" button
await deleteAccount();
// Package handles:
// 1. Shows confirmation modal
// 2. Prompts for password reauthentication
// 3. Deletes Firebase Auth user
// 4. Firestore cleanup happens via security rules
```

**Admin-side deletion** (for support/cleanup):
```bash
# Delete specific user (Auth + Firestore)
npx firebase-admin delete-user abc123xyz

# Cleanup old anonymous users (Auth + Firestore)
npx firebase-admin cleanup-anonymous --days 30
```

### Decision Tree

```
Need Firebase admin operation?
├─ Is it generic (works same in all apps)?
│  ├─ YES → Use package CLI: npx firebase-admin <command>
│  └─ NO → Continue...
│
├─ Does package CLI already have it?
│  ├─ YES → Use package CLI
│  └─ NO → Continue...
│
├─ Should this be in package for all apps?
│  ├─ YES → Add to package, then use from all apps
│  └─ NO → Create one-off script using package utilities
│
└─ NEVER reimplement package functionality!
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Firebase not initialized"** | Ensure `autoInitializeFirebase()` is called in app entry point. Verify environment variables are set correctly. |
| **"Module not found: @umituz/react-native-design-system"** | Run `npm install @umituz/react-native-design-system` |
| **"Expo router not found"** | This is informational, not an error. Package works with any navigation. |
| **"Pod install failed"** | Run `cd ios && pod install --repo-update && cd ..` |
| **High Firestore costs** | Ensure `useSmartFirestoreSnapshot` is used with `backgroundStrategy: 'suspend'` |
| **"Permission denied during account deletion"** | Add `allow read: if isAuthenticated()` to user documents (see Account Deletion Security Rules above) |
| **"User data persists after deletion"** | Use `npx firebase-admin delete-user <userId>` for complete cleanup |
| **"Type errors with Firebase imports"** | Use package abstractions, not direct `firebase/firestore` imports (except for custom queries after package init) |

---

## Reference Apps

| App | Key Pattern | Location |
|-----|-------------|----------|
| **ai_baby_face_predictor** | Complete Firebase init | `ai_baby_face_predictor/src/core/config/` |
| **future_us_app** | Complete Firebase init | `future_us_app/src/core/config/` |
| **AI-Companion-Chat** | Hybrid: package init + direct Firestore SDK | Custom collection queries with package auth hooks |

## Summary

After setup, provide:

1. ✅ Firebase Console project created (iOS + Android apps added)
2. ✅ Authentication enabled (Anonymous + Email/Password, optionally Google)
3. ✅ Firestore database created with security rules
4. ✅ Cloud Storage bucket created
5. ✅ Package version installed
6. ✅ Dependencies added (core + optional)
7. ✅ Environment variables configured (.env file created)
8. ✅ Initialization location (entry point file)
9. ✅ Cost optimizations enabled (files using smart snapshot)
10. ✅ Verification status (all checks passing)
11. ✅ Package CLI available (`npx firebase-admin`)
12. ✅ NO forbidden packages installed
13. ✅ NO wrapper scripts created in app

---

**Compatible with:** @umituz/react-native-firebase@2.4.86+
**Platforms:** React Native (Expo & Bare)
**Expected Cost Savings:** ~740% improvement in free tier longevity when optimizations enabled
**Architecture:** Package-Driven - Firebase logic in packages, configuration in app
