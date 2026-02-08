/**
 * Enrichment Mapper Utility
 * Document mapping with single enrichment source
 */

import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

/**
 * Map documents with enrichment from related data
 *
 * Process flow:
 * 1. Extract source data from document
 * 2. Skip if extraction fails or source is invalid
 * 3. Get enrichment key from source
 * 4. Fetch enrichment data using the key
 * 5. Skip if enrichment data not found
 * 6. Combine source and enrichment into result
 */
export async function mapWithEnrichment<TSource, TEnrichment, TResult>(
  docs: QueryDocumentSnapshot<DocumentData>[],
  extractSource: (doc: QueryDocumentSnapshot<DocumentData>) => TSource | null,
  getEnrichmentKey: (source: TSource) => string,
  fetchEnrichment: (key: string) => Promise<TEnrichment | null>,
  combineData: (source: TSource, enrichment: TEnrichment) => TResult,
): Promise<TResult[]> {
  const results: TResult[] = [];

  for (const doc of docs) {
    const source = extractSource(doc);
    if (!source) continue;

    const enrichmentKey = getEnrichmentKey(source);
    const enrichment = await fetchEnrichment(enrichmentKey);
    if (!enrichment) continue;

    results.push(combineData(source, enrichment));
  }

  return results;
}

/**
 * Map documents with batch enrichment (fetch all enrichments at once)
 */
export async function mapWithBatchEnrichment<TSource, TEnrichment, TResult>(
  docs: QueryDocumentSnapshot<DocumentData>[],
  extractSource: (doc: QueryDocumentSnapshot<DocumentData>) => TSource | null,
  getEnrichmentKey: (source: TSource) => string,
  fetchBatchEnrichments: (keys: string[]) => Promise<Map<string, TEnrichment>>,
  combineData: (source: TSource, enrichment: TEnrichment) => TResult,
): Promise<TResult[]> {
  // First, extract all sources and collect keys
  const sources: TSource[] = [];
  const keys: string[] = [];

  for (const doc of docs) {
    const source = extractSource(doc);
    if (source) {
      sources.push(source);
      keys.push(getEnrichmentKey(source));
    }
  }

  if (sources.length === 0) {
    return [];
  }

  // Fetch all enrichments in batch
  const enrichmentMap = await fetchBatchEnrichments(keys);

  // Combine sources with enrichments
  const results: TResult[] = [];
  for (const source of sources) {
    const key = getEnrichmentKey(source);
    const enrichment = enrichmentMap.get(key);
    if (enrichment) {
      results.push(combineData(source, enrichment));
    }
  }

  return results;
}
