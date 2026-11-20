export type SearchResult = {
  name: string;
  url: string;
  /** Snippet supplied by the search engine, when it has one. */
  snippet?: string;
  /** Provider that produced this result. */
  provider?: string;
  /** Rank supplied by the engine, before cross-provider merging. */
  position?: number;
};

export interface SearchConfig {
  apiKey?: string; // Brave or Serper key
  url?: string; // SearXNG base URL
  excludedSites: string[];
}

export interface SearchOptions {
  /** Maximum results to return. Providers may be asked for more than this. */
  limit?: number;
}

/**
 * A search engine behind one interface. Adapters throw on failure; the chain
 * translates a thrown error into an attempt and moves to the next provider.
 */
export interface SearchProvider {
  name: string;
  search(question: string, options?: SearchOptions): Promise<SearchResult[]>;
}

export type SearchAttemptStatus = 'ok' | 'empty' | 'error' | 'skipped';

export interface SearchAttempt {
  provider: string;
  status: SearchAttemptStatus;
  count: number;
  latencyMs: number;
  error?: string;
  /** Why a provider was skipped, e.g. "no API key". */
  reason?: string;
}

export interface SearchOutcome {
  results: SearchResult[];
  attempts: SearchAttempt[];
}
