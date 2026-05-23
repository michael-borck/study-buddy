export type SearchResult = { name: string; url: string };

export interface SearchConfig {
  apiKey?: string; // settings.searchApiKey
  url?: string; // settings.searchUrl (SearXNG)
  excludedSites: string[];
}

/**
 * A search engine behind one interface. Adapters throw on failure; the route
 * translates a thrown error into a 500 response.
 */
export interface SearchProvider {
  name: string;
  search(question: string): Promise<SearchResult[]>;
}
