/**
 * Base Mapper Utility
 * Core document mapping functionality
 */

import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

/**
 * Simple document mapping without enrichment
 */
export function mapDocuments<T>(
  docs: QueryDocumentSnapshot<DocumentData>[],
  extractData: (doc: QueryDocumentSnapshot<DocumentData>) => T | null,
): T[] {
  const results: T[] = [];

  for (const doc of docs) {
    const data = extractData(doc);
    if (data != null) {
      results.push(data);
    }
  }

  return results;
}

/**
 * Filter out null values from array
 */
export function filterNull<T>(items: (T | null)[]): T[] {
  return items.filter((item): item is T => item != null);
}

/**
 * Safe document extraction with null check
 */
export function extractDocumentData<T>(
  doc: QueryDocumentSnapshot<DocumentData>,
  extractor: (doc: QueryDocumentSnapshot<DocumentData>) => T | null
): T | null {
  return extractor(doc);
}
