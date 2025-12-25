import type { Firestore } from "firebase/firestore";
import { collection, doc } from "firebase/firestore";

/**
 * Resolves Firestore paths for user collections
 * Standard pattern: users/{userId}/{collectionName}
 * 
 * This class is designed to be used across hundreds of apps.
 * All user data MUST be under users/{userId}/ for consistency.
 */
export class FirestorePathResolver {
    constructor(
        private readonly collectionName: string,
        private readonly db: Firestore | null,
    ) { }

    /**
     * Get collection reference for a user
     * Pattern: users/{userId}/{collectionName}
     * 
     * @param userId User identifier
     * @returns CollectionReference or null if db not initialized
     */
    getUserCollection(userId: string) {
        if (!this.db) return null;
        return collection(this.db, "users", userId, this.collectionName);
    }

    /**
     * Get document reference for a specific item
     * Pattern: users/{userId}/{collectionName}/{documentId}
     * 
     * @param userId User identifier
     * @param documentId Document identifier
     * @returns DocumentReference or null if db not initialized
     */
    getDocRef(userId: string, documentId: string) {
        if (!this.db) return null;
        return doc(this.db, "users", userId, this.collectionName, documentId);
    }
}
