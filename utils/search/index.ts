import { AppSettings } from "../settings";
import { SearchConfig, SearchProvider } from "./types";
import { BingSearch } from "./bing";
import { SerperSearch } from "./serper";
import { SearxngSearch } from "./searxng";
import { DuckDuckGoSearch } from "./duckduckgo";
import { BraveSearch } from "./brave";

export * from "./types";

// Sites never worth teaching from (e.g. video pages with no readable text).
export const EXCLUDED_SITES = ["youtube.com"];

/**
 * Build the search adapter for the configured engine. Returns null when search
 * is disabled or the engine is unknown — the caller treats that as "no results".
 */
export function createSearchProvider(settings: AppSettings): SearchProvider | null {
  const config: SearchConfig = {
    apiKey: settings.searchApiKey,
    url: settings.searchUrl,
    excludedSites: EXCLUDED_SITES,
  };

  switch (settings.searchEngine) {
    case "bing":
      return new BingSearch(config);
    case "serper":
      return new SerperSearch(config);
    case "searxng":
      return new SearxngSearch(config);
    case "duckduckgo":
      return new DuckDuckGoSearch(config);
    case "brave":
      return new BraveSearch(config);
    default:
      return null;
  }
}
