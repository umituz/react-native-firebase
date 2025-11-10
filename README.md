# @umituz/react-native-firebase

Domain-Driven Design Firebase client for React Native apps with type-safe operations and singleton pattern.

Built with **SOLID**, **DRY**, and **KISS** principles.

## Installation

```bash
npm install @umituz/react-native-firebase
```

## Peer Dependencies

- `firebase` >= 11.0.0
- `react` >= 18.2.0
- `react-native` >= 0.74.0
- `@react-native-async-storage/async-storage` >= 1.21.0

## Features

- ✅ Domain-Driven Design (DDD) architecture
- ✅ SOLID principles (Single Responsibility, Open/Closed, etc.)
- ✅ DRY (Don't Repeat Yourself)
- ✅ KISS (Keep It Simple, Stupid)
- ✅ Singleton pattern for single client instance
- ✅ Type-safe Firebase operations
- ✅ Platform-specific initialization (Web vs Native)
- ✅ **Security**: No .env reading - configuration must be provided by app
- ✅ Works with Expo and React Native CLI

## Important: Configuration

**This package does NOT read from .env files for security reasons.** You must provide configuration from your application code.

### Why?

- **Security**: Prevents accidental exposure of credentials
- **Flexibility**: Works with any configuration source (Constants, config files, etc.)
- **Multi-app support**: Same package can be used across hundreds of apps with different configs

## Usage

### 1. Initialize Firebase Client

Initialize the client early in your app (e.g., in `App.tsx` or `index.js`):

```typescript
import { initializeFirebase } from '@umituz/react-native-firebase';
import Constants from 'expo-constants';

// Get configuration from your app's config source
const config = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId,
};

// Initialize
const app = initializeFirebase(config);

if (!app) {
  console.error('Failed to initialize Firebase');
}
```

### 2. Use Firebase Services

#### Direct Access

```typescript
import { getFirebaseApp, getFirebaseAuth, getFirestore } from '@umituz/react-native-firebase';

// Get instances
const app = getFirebaseApp();
const auth = getFirebaseAuth();
const db = getFirestore();

// Use Firebase features
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';

// Sign in
await signInWithEmailAndPassword(auth, email, password);

// Query Firestore
const querySnapshot = await getDocs(collection(db, 'users'));
```

### 3. Error Handling

```typescript
import {
  getFirebaseApp,
  FirebaseInitializationError,
  FirebaseConfigurationError,
} from '@umituz/react-native-firebase';

try {
  const app = getFirebaseApp();
  // Use app
} catch (error) {
  if (error instanceof FirebaseInitializationError) {
    console.error('Firebase not initialized:', error.message);
  } else if (error instanceof FirebaseConfigurationError) {
    console.error('Invalid configuration:', error.message);
  }
}
```

### 4. Check Initialization Status

```typescript
import {
  isFirebaseInitialized,
  getFirebaseInitializationError,
} from '@umituz/react-native-firebase';

if (isFirebaseInitialized()) {
  console.log('Firebase is ready');
} else {
  const error = getFirebaseInitializationError();
  console.error('Initialization error:', error);
}
```

## Architecture

### SOLID Principles

- **Single Responsibility**: Each class has one clear purpose
  - `FirebaseConfigValidator`: Only validates configuration
  - `FirebaseAppInitializer`: Only initializes Firebase App
  - `FirebaseAuthInitializer`: Only initializes Auth
  - `FirebaseFirestoreInitializer`: Only initializes Firestore
  - `FirebaseClient`: Only orchestrates initialization

- **Open/Closed**: Extensible through configuration, closed for modification

- **Dependency Inversion**: Depends on abstractions (interfaces), not concrete implementations

### DRY (Don't Repeat Yourself)

- Shared initialization logic extracted to specialized classes
- No code duplication across platforms

### KISS (Keep It Simple, Stupid)

- Simple, focused classes
- Clear responsibilities
- Easy to understand and maintain

## API

### Functions

- `initializeFirebase(config)`: Initialize Firebase client with configuration
- `getFirebaseApp()`: Get Firebase app instance (throws if not initialized)
- `getFirebaseAuth()`: Get Firebase Auth instance (throws if not initialized)
- `getFirestore()`: Get Firestore instance (throws if not initialized)
- `isFirebaseInitialized()`: Check if client is initialized
- `getFirebaseInitializationError()`: Get initialization error if any
- `resetFirebaseClient()`: Reset client instance (useful for testing)

### Types

- `FirebaseConfig`: Configuration interface
- `FirebaseApp`: Firebase app type
- `Auth`: Firebase Auth type
- `Firestore`: Firestore type

### Errors

- `FirebaseError`: Base error class
- `FirebaseInitializationError`: Initialization errors
- `FirebaseConfigurationError`: Configuration errors
- `FirebaseAuthError`: Authentication errors
- `FirebaseFirestoreError`: Firestore errors

## Integration with Expo

For Expo apps, configure in `app.config.js`:

```javascript
module.exports = () => {
  return {
    expo: {
      // ... other config
      extra: {
        firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      },
    },
  };
};
```

## Security Best Practices

1. **Never commit credentials**: Use environment variables or secure config files
2. **Use proper Firebase security rules**: Configure Firestore and Storage rules
3. **Implement RLS**: Use Firebase security rules for data protection
4. **Clear user data on logout**: Always clear user data on logout (GDPR compliance)

## License

MIT


