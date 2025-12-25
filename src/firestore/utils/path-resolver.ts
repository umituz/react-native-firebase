import type { Firestore } from "firebase/firestore";
import { collection, doc } from "firebase/firestore";

/**
 * Path builder function type
 * Allows apps to define custom Firestore path structures
 * 
 * @example
 * // Default: users/{userId}/creations
 * (userId) => ["users", userId, "creations"]
 * 
 * @example
 * // Alternative: creations/{userId}/items
 * (userId) => ["creations", userId, "items"]
 */
export type PathBuilder = (userId: string) => string[];

/**
 * Resolves Firestore paths dynamically
 * Single Responsibility: Path resolution and reference creation
 * 
 * This class is designed to be used across hundreds of apps.
 * It provides a consistent way to build Firestore paths and references.
 */
export class FirestorePathResolver {
    constructor(
        private readonly pathBuilder: PathBuilder,
        private readonly db: Firestore | null,
    ) { }

    /**
     * Get collection reference for a user
     * @param userId User identifier
     * @returns CollectionReference or null if db not initialized
     */
    getUserCollection(userId: string) {
        if (!this.db) return null;
        const pathSegments = this.pathBuilder(userId);
        const [first, ...rest] = pathSegments;
        if (!first) return null;
        return collection(this.db, first, ...rest);
    }

    /**
     * Get document reference for a specific item
     * @param userId User identifier
     * @param documentId Document identifier
     * @returns DocumentReference or null if db not initialized
     */
    getDocRef(userId: string, documentId: string) {
        if (!this.db) return null;
        const pathSegments = this.pathBuilder(userId);
        const [first, ...rest] = pathSegments;
        if (!first) return null;
        return doc(this.db, first, ...rest, documentId);
    }
}

/**
 * Creates a default path builder for standard user collections
 * Pattern: users/{userId}/{collectionName}
 * 
 * @param collectionName Name of the collection
 * @returns PathBuilder function
 */
export const createDefaultPathBuilder = (collectionName: string): PathBuilder =>
    (userId: string) => ["users", userId, collectionName];
