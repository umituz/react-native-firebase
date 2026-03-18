import { getFirestore, initializeFirestore, memoryLocalCache } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { FirebaseApp } from 'firebase/app';

export class FirebaseFirestoreInitializer {
  static initialize(app: FirebaseApp): Firestore {
    try {
      return initializeFirestore(app, { localCache: memoryLocalCache() });
    } catch {
      return getFirestore(app);
    }
  }
}
