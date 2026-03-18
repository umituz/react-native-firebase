---
description: Sets up or updates the @umituz/react-native-firebase package in a React Native app.
---

# Firebase Infrastructure Setup Workflow

This workflow provides automated setup for `@umituz/react-native-firebase` integration.

## Quick Start

Just invoke this workflow when you want to:
- Install @umituz/react-native-firebase in a new project
- Update existing installation to latest version
- Configure Firebase credentials and initialization
- Set up optimal cost-saving configurations

## Step 1: Check and Update `package.json`

Analyze the project's `package.json`:
- Check if `@umituz/react-native-firebase` exists in dependencies
- Check version (current: 2.4.86)
- If missing: Run `npm install @umituz/react-native-firebase`
- If outdated: Run `npm install @umituz/react-native-firebase@latest`

## Step 2: Install Peer Dependencies

Install required peer dependencies:

### Core Dependencies
```bash
# Firebase SDK
npm install firebase

# State Management
npm install @umituz/react-native-design-system

# Query Library
npm install @tanstack/react-query
```

### React Navigation (if using)
```bash
npm install @gorhom/portal
```

### Authentication Dependencies (if using social auth)
```bash
# For Expo projects
npx expo install expo-apple-authentication expo-auth-session expo-crypto expo-web-browser

# For bare React Native
npm install @react-native-firebase/app @react-native-firebase/auth
```

## Step 3: Check Environment Variables

Verify Firebase credentials are configured. Check for these environment variables:

**Required:**
- `EXPO_PUBLIC_FIREBASE_API_KEY`
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`

**Optional:**
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `EXPO_PUBLIC_FIREBASE_APP_ID`

Check if `.env` or `.env.example` exists. If not, create `.env.example`:
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Step 4: Setup Initialization Logic

Locate the main entry point (usually `App.tsx`, `index.js`, `app/_layout.tsx` for Expo Router).

Check if Firebase is initialized. If not, add initialization:

```typescript
import { autoInitializeFirebase } from '@umituz/react-native-firebase';

// Call initialization early in app lifecycle
useEffect(() => {
  autoInitializeFirebase();
}, []);
```

For Expo Router (app/_layout.tsx):
```typescript
import { autoInitializeFirebase } from '@umituz/react-native-firebase';

export default function RootLayout() {
  // Initialize Firebase when app starts
  autoInitializeFirebase();

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}>
        {/* your screens */}
      </Stack.Screen>
    </Stack>
  );
}
```

## Step 5: Native Setup (Bare React Native Only)

If the project has an `ios/` folder (bare React Native):
```bash
cd ios && pod install
cd ..
```

For Android, no additional setup needed beyond Step 4.

## Step 6: Verify Setup

Run the app and verify:
- No Firebase initialization errors
- Firestore queries work
- Authentication works (if configured)
- Quota tracking is active (check __DEV__ logs)

## Step 7: Enable Cost Optimizations (Recommended)

For production apps, enable smart cost-saving features:

```typescript
import { useSmartFirestoreSnapshot } from '@umituz/react-native-firebase';

// Instead of useFirestoreSnapshot, use the smart version
const { data } = useSmartFirestoreSnapshot({
  queryKey: ['my-data'],
  subscribe: (onData) => onSnapshot(collection(db, 'data'), (snap) => {
    onData(snap.docs.map(d => d.data()));
  }),
  backgroundStrategy: 'suspend', // Saves battery and data when app backgrounds
});
```

## Troubleshooting

**Issue:** "Firebase not initialized"
- **Solution:** Make sure `autoInitializeFirebase()` is called in app entry point
- **Solution:** Verify environment variables are set correctly

**Issue:** "Module not found: @umituz/react-native-design-system"
- **Solution:** Run `npm install @umituz/react-native-design-system`

**Issue:** "Expo router not found"
- **Solution:** This package works with any navigation, adjust import paths as needed

## Step 8: Summary

After setup, provide user with:
1. ✅ Packages installed/updated: [list versions]
2. ✅ Environment variables configured: [list keys]
3. ✅ Initialization added to: [file path]
4. ✅ Cost optimizations enabled: [smart snapshot, persistent cache, etc.]
5. ✅ Next steps: [initialize auth, setup Firestore, etc.]

## Additional Resources

- Documentation: See README.md for detailed API reference
- Examples: Check `/examples` folder (if exists)
- Support: Report issues on GitHub

---
**Last Updated:** 2025-03-18
**Package Version:** 2.4.86
**Platform:** React Native (Expo & Bare)
