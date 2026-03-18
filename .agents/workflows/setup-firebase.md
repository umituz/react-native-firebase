---
description: Sets up or updates the @umituz/react-native-firebase package in a React Native app.
---

# Firebase Infrastructure Setup Skill

When this workflow/skill is invoked, follow these explicit instructions to configure `@umituz/react-native-firebase`.

## Step 1: Check and Update `package.json`
- Analyze the project's `package.json`.
- Check if `@umituz/react-native-firebase` exists.
  - If missing: Install with `npm install @umituz/react-native-firebase`.
  - If outdated: Update it to the latest version.

## Step 2: Install Peer Dependencies
Check and install any missing peer dependencies (use `npx expo install` for Expo packages to ensure compatibility):
- `firebase`
- `@gorhom/portal`
- `@tanstack/react-query`
- `@umituz/react-native-design-system`
- `expo-apple-authentication`, `expo-auth-session`, `expo-crypto`, `expo-web-browser`

## Step 3: Check Environment Variables
- Ensure that Firebase credentials (like `FIREBASE_API_KEY`, `FIREBASE_PROJECT_ID`, etc.) are defined in the project's `.env.example` and `.env` files. If they are missing, prompt the user to add them or scaffold the keys.

## Step 4: Setup Initialization Logic
- Locate the main entry point (e.g. `App.tsx`, `index.js`, or a dedicated config file).
- Check if Firebase is initialized.
- If not, import and implement the initialization boilerplate from `@umituz/react-native-firebase`:
  ```typescript
  import { autoInitializeFirebase } from '@umituz/react-native-firebase';
  
  // Call initialization logic early in the app lifecycle
  ```

// turbo
## Step 5: Native Setup (If bare React Native)
If the project structure indicates an iOS build folder is present, run:
```bash
cd ios && pod install
```

## Step 6: Summary
Output what was done: the packages that were updated, the environment keys that were checked/added, and the files modified to include initialization logic.
