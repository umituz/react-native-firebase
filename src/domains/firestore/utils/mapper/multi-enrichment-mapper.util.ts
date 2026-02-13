/**
 * Multiple Enrichment Mapper Utility
 * Document mapping with multiple enrichment sources
 */

import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

/**
 * Map documents with multiple enrichments
 *
 * Similar to mapWithEnrichment but supports multiple enrichment sources.
 * Useful when result needs data from multiple related collections.
 */
export async function mapWithMultipleEnrichments<
  TSource,
  TEnrichments extends Record<string, unknown>,
  TResult
>(
  docs: QueryDocumentSnapshot<DocumentData>[],
  extractSource: (doc: QueryDocumentSnapshot<DocumentData>) => TSource | null,
  getEnrichmentKeys: (source: TSource) => Record<string, string>,
  fetchEnrichments: (keys: Record<string, string>) => Promise<TEnrichments | null>,
  combineData: (source: TSource, enrichments: TEnrichments) => TResult,
): Promise<TResult[]> {
  const results: TResult[] = [];

  for (const doc of docs) {
    const source = extractSource(doc);
    if (!source) continue;

    const enrichmentKeys = getEnrichmentKeys(source);
    const enrichments = await fetchEnrichments(enrichmentKeys);
    if (!enrichments) continue;

    results.push(combineData(source, enrichments));
  }

  return results;
}
