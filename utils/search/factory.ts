import { AppSettings } from "../settings";
import { SearchConfig, SearchProvider } from "./types";
import { SerperSearch } from "./serper";
import { SearxngSearch } from "./searxng";
import { DuckDuckGoSearch } from "./duckduckgo";
import { BraveSearch } from "./brave";

// Sites never worth teaching from (e.g. video pages with no readable text).
export const EXCLUDED_SITES = ["youtube.com"];

export const SEARCH_PROVIDERS = [
  "brave",
  "serper",
  "searxng",
  "duckduckgo",
] as const;

export type SearchProviderName = (typeof SEARCH_PROVIDERS)[number];

export function isKnownProvider(name: string): name is SearchProviderName {
  return (SEARCH_PROVIDERS as readonly string[]).includes(name);
}

function apiKeyFor(name: SearchProviderName, settings: AppSettings): string {
  if (name === "brave") {
    return (
      settings.braveApiKey ||
      (settings.searchEngine === "brave" ? settings.searchApiKey : "")
    );
  }
  if (name === "serper") {
    return (
      settings.serperApiKey ||
      (settings.searchEngine === "serper" ? settings.searchApiKey : "")
    );
  }
  return "";
}

/** True when the provider has everything it needs to run. */
export function isProviderConfigured(
  name: SearchProviderName,
  settings: AppSettings,
): boolean {
  switch (name) {
    case "brave":
    case "serper":
      return Boolean(apiKeyFor(name, settings).trim());
    case "searxng":
      return Boolean(settings.searchUrl.trim());
    case "duckduckgo":
      return true;
  }
}

/**
 * Build one adapter by name. Returns null when the provider is unknown or not
 * configured; the chain reports that as a skipped attempt.
 */
export function createSearchProvider(
  name: string,
  settings: AppSettings,
): SearchProvider | null {
  if (!isKnownProvider(name)) return null;
  if (!isProviderConfigured(name, settings)) return null;

  const config: SearchConfig = {
    apiKey: apiKeyFor(name, settings),
    url: settings.searchUrl,
    excludedSites: EXCLUDED_SITES,
  };

  switch (name) {
    case "brave":
      return new BraveSearch(config);
    case "serper":
      return new SerperSearch(config);
    case "searxng":
      return new SearxngSearch(config);
    case "duckduckgo":
      return new DuckDuckGoSearch(config);
  }
}
