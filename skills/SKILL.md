---
name: setup-react-native-firebase
description: Sets up @umituz/react-native-firebase in React Native or Expo apps with automated installation, configuration, and cost optimizations. Triggers on: Setup Firebase, initialize Firebase, Firebase configuration, install Firebase, Firebase setup, autoInitializeFirebase, Firebase integration, Firestore setup, @umituz/react-native-firebase.
---

# Setup React Native Firebase

Comprehensive automated setup for `@umituz/react-native-firebase` package with production-ready cost optimizations.

## Overview

This skill handles everything needed to integrate Firebase into your React Native or Expo app:
- Package installation and updates
- Peer dependency management
- Environment configuration
- Firebase initialization
- Cost-saving optimizations (enabled by default)
- Native setup for bare React Native

## Quick Start

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
| Forgetting peer dependencies | Always install `firebase`, `@tanstack/react-query`, `@umituz/react-native-design-system` |
| Missing environment variables | Create .env with EXPO_PUBLIC_FIREBASE_* variables |
| Not calling autoInitializeFirebase() | Add useEffect to app entry point |
| Using useFirestoreSnapshot instead of useSmartFirestoreSnapshot | Replace to enable cost optimizations |
| Running pod install in wrong directory | Use `cd ios && pod install && cd ..` |
| Committing .env file | Add .env to .gitignore |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| **"Firebase not initialized"** | Ensure `autoInitializeFirebase()` is called in app entry point. Verify environment variables are set correctly. |
| **"Module not found: @umituz/react-native-design-system"** | Run `npm install @umituz/react-native-design-system` |
| **"Expo router not found"** | This is informational, not an error. Package works with any navigation. |
| **"Pod install failed"** | Run `cd ios && pod install --repo-update && cd ..` |
| **High Firestore costs** | Ensure `useSmartFirestoreSnapshot` is used with `backgroundStrategy: 'suspend'` |

## Summary

After setup, provide:

1. ✅ Package version installed
2. ✅ Dependencies added (core + optional)
3. ✅ Environment variables configured
4. ✅ Initialization location (entry point file)
5. ✅ Cost optimizations enabled (files using smart snapshot)
6. ✅ Verification status (all checks passing)

---

**Compatible with:** @umituz/react-native-firebase@2.4.86+
**Platforms:** React Native (Expo & Bare)
**Expected Cost Savings:** ~740% improvement in free tier longevity when optimizations enabled
