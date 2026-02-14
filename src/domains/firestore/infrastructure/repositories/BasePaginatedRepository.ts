/**
 * Base Repository - Pagination Operations
 *
 * Provides pagination operations for Firestore repositories.
 * Extends BaseQueryRepository with pagination-specific functionality.
 */

import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { collection, query, orderBy, limit, startAfter, getDoc, doc, getDocs } from "firebase/firestore";
import { PaginationHelper } from "../../utils/pagination.helper";
import type { PaginatedResult, PaginationParams } from "../../types/pagination.types";
import { BaseQueryRepository } from "./BaseQueryRepository";

export abstract class BasePaginatedRepository extends BaseQueryRepository {
  /**
   * Validate cursor format
   * Cursors must be non-empty strings without path separators
   */
  private isValidCursor(cursor: string): boolean {
    if (!cursor || typeof cursor !== 'string') return false;
    // Check for invalid characters (path separators, null bytes)
    if (cursor.includes('/') || cursor.includes('\\') || cursor.includes('\0')) return false;
    // Check length (Firestore document IDs can't be longer than 1500 bytes)
    if (cursor.length > 1500) return false;
    return true;
  }

  /**
   * Execute paginated query with cursor support
   *
   * Generic helper for cursor-based pagination queries.
   * Automatically handles cursor document fetching and result building.
   *
   * @param collectionName - Firestore collection name
   * @param params - Pagination parameters
   * @param orderByField - Field to order by (default: "createdAt")
   * @param orderDirection - Sort direction (default: "desc")
   * @returns QueryDocumentSnapshot array (limit + 1 for hasMore detection)
   */
  protected async executePaginatedQuery(
    collectionName: string,
    params?: PaginationParams,
    orderByField: string = "createdAt",
    orderDirection: "asc" | "desc" = "desc",
  ): Promise<QueryDocumentSnapshot<DocumentData>[]> {
    const db = this.getDb();
    if (!db) {
      return [];
    }

    const helper = new PaginationHelper();
    const pageLimit = helper.getLimit(params);
    const fetchLimit = helper.getFetchLimit(pageLimit);

    const collectionRef = collection(db, collectionName);
    let q: import("firebase/firestore").Query<DocumentData>;
    let cursorKey = 'start';

    // Handle cursor-based pagination
    if (helper.hasCursor(params) && params?.cursor) {
      cursorKey = params.cursor;

      // Validate cursor format to prevent Firestore errors
      if (!this.isValidCursor(params.cursor)) {
        // Invalid cursor format - return empty result
        return [];
      }

      // Fetch cursor document first
      const cursorDocRef = doc(db, collectionName, params.cursor);
      const cursorDoc = await getDoc(cursorDocRef);

      if (!cursorDoc.exists()) {
        // Cursor document doesn't exist - return empty result
        return [];
      }

      // Build query with startAfter using the cursor document
      q = query(
        collectionRef,
        orderBy(orderByField, orderDirection),
        startAfter(cursorDoc),
        limit(fetchLimit),
      );
    } else {
      // No cursor - build standard query
      q = query(
        collectionRef,
        orderBy(orderByField, orderDirection),
        limit(fetchLimit),
      );
    }

    // Generate a unique key for deduplication (after cursor is resolved)
    const uniqueKey = `${collectionName}_list_${orderByField}_${orderDirection}_${fetchLimit}_${cursorKey}`;

    return this.executeQuery(
      collectionName,
      q,
      async () => {
        const snapshot = await getDocs(q);
        return snapshot.docs;
      },
      false, // Default to false as we don't know yet
      uniqueKey
    );
  }

  /**
   * Build paginated result from documents
   *
   * Helper to convert raw Firestore documents to paginated result.
   * Works with any document type and cursor extraction logic.
   *
   * @param docs - Firestore document snapshots
   * @param params - Pagination parameters
   * @param extractData - Function to extract data from document
   * @param getCursor - Function to extract cursor from data
   * @returns Paginated result
   */
  protected buildPaginatedResult<T>(
    docs: QueryDocumentSnapshot<DocumentData>[],
    params: PaginationParams | undefined,
    extractData: (doc: QueryDocumentSnapshot<DocumentData>) => T | null,
    getCursor: (item: T) => string,
  ): PaginatedResult<T> {
    const items: T[] = [];
    for (const doc of docs) {
      const data = extractData(doc);
      if (data) items.push(data);
    }

    const helper = new PaginationHelper<T>();
    const pageLimit = helper.getLimit(params);
    return helper.buildResult(items, pageLimit, getCursor);
  }
}
