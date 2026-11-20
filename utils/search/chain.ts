import type { AppSettings } from "../settings";
import {
  createSearchProvider,
  isKnownProvider,
  type SearchProviderName,
} from "./factory";
import type {
  SearchAttempt,
  SearchOutcome,
  SearchProvider,
  SearchResult,
} from "./types";

const DEFAULT_LIMIT = 9;
const MAX_CACHE_ENTRIES = 50;
const CACHE_TTL_MS = 10 * 60 * 1000;
const BREAKER_MS = 60 * 1000;
const DEFAULT_ORDER = "brave,serper,searxng,duckduckgo";

const cache = new Map<string, { at: number; outcome: SearchOutcome }>();
const breaker = new Map<string, number>();

const TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "mc_cid",
  "mc_eid",
];

/**
 * Normalise a comma-separated provider order: lowercase, known names only,
 * no duplicates. Falls back to the default order when nothing valid is left.
 */
export function normaliseFallbackOrder(value: string | undefined): string {
  const seen = new Set<string>();
  const names: string[] = [];
  for (const part of (value ?? DEFAULT_ORDER).split(",")) {
    const name = part.trim().toLowerCase();
    if (!isKnownProvider(name) || seen.has(name)) continue;
    seen.add(name);
    names.push(name);
  }
  return names.length ? names.join(",") : DEFAULT_ORDER;
}

function buildOrder(settings: AppSettings): string[] {
  if (settings.searchEngine === "disabled") return [];

  const primary = settings.searchEngine.toLowerCase();
  const fallback = settings.searchFallbackEnabled
    ? normaliseFallbackOrder(settings.searchFallbackOrder).split(",")
    : [];

  const seen = new Set<string>();
  const order: string[] = [];
  for (const name of [primary, ...fallback]) {
    if (!isKnownProvider(name) || seen.has(name)) continue;
    seen.add(name);
    order.push(name);
  }
  return order;
}

function isHttpUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      Boolean(url.hostname)
    );
  } catch {
    return false;
  }
}

function normaliseUrl(raw: string): string {
  try {
    const url = new URL(raw);
    url.hash = "";
    for (const key of TRACKING_PARAMS) url.searchParams.delete(key);
    url.hostname = url.hostname.toLowerCase().replace(/^www\./, "");
    let value = url.toString();
    if (value.endsWith("/")) value = value.slice(0, -1);
    return value;
  } catch {
    return raw;
  }
}

function mergeResults(
  results: SearchResult[],
  provider: string,
  limit: number,
): SearchResult[] {
  const seen = new Set<string>();
  const merged: SearchResult[] = [];
  for (const result of results) {
    if (!isHttpUrl(result.url)) continue;
    const key = normaliseUrl(result.url);
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push({ ...result, provider });
    if (merged.length >= limit) break;
  }
  return merged;
}

function breakerOpen(name: string): boolean {
  const until = breaker.get(name);
  if (!until) return false;
  if (Date.now() >= until) {
    breaker.delete(name);
    return false;
  }
  return true;
}

function tripBreaker(name: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  if (/\b(429|500|502|503|504)\b|timeout|aborted|fetch failed|rate limit/i.test(message)) {
    breaker.set(name, Date.now() + BREAKER_MS);
  }
}

function fingerprint(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function keyFor(
  name: SearchProviderName,
  settings: AppSettings,
): string {
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

function cacheKey(
  question: string,
  settings: AppSettings,
  order: string[],
  limit: number,
): string {
  const config = [
    settings.searchEngine,
    settings.searchFallbackEnabled ? "on" : "off",
    order.join(","),
    fingerprint(keyFor("brave", settings)),
    fingerprint(keyFor("serper", settings)),
    fingerprint(settings.searchUrl),
    limit,
  ].join("|");
  return `${question}::${config}`;
}

export interface ChainEntry {
  name: string;
  provider: SearchProvider | null;
}

/**
 * Run providers in order and stop at the first one that returns usable
 * results. Empty and failed providers fall through. Tests can call this
 * directly with fake providers.
 */
export async function runSearchChain(
  question: string,
  entries: ChainEntry[],
  limit = DEFAULT_LIMIT,
): Promise<SearchOutcome> {
  const attempts: SearchAttempt[] = [];

  for (const entry of entries) {
    if (!entry.provider) {
      attempts.push({
        provider: entry.name,
        status: "skipped",
        count: 0,
        latencyMs: 0,
        reason: "not configured",
      });
      continue;
    }

    if (breakerOpen(entry.name)) {
      attempts.push({
        provider: entry.name,
        status: "skipped",
        count: 0,
        latencyMs: 0,
        reason: "cooling down after a rate limit",
      });
      continue;
    }

    const started = Date.now();
    try {
      // Over-fetch so filtering, deduplication and dead links still leave a
      // useful number of results.
      const raw = await entry.provider.search(question, { limit: limit * 2 });
      const results = mergeResults(raw, entry.name, limit);
      const latencyMs = Date.now() - started;
      attempts.push({
        provider: entry.name,
        status: results.length ? "ok" : "empty",
        count: results.length,
        latencyMs,
      });
      if (results.length) {
        breaker.delete(entry.name);
        return { results, attempts };
      }
    } catch (error) {
      const latencyMs = Date.now() - started;
      tripBreaker(entry.name, error);
      attempts.push({
        provider: entry.name,
        status: "error",
        count: 0,
        latencyMs,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return { results: [], attempts };
}

/**
 * Search with the configured primary provider, then the fallback order.
 * Results are cached briefly. An empty or failed provider does not stop the
 * chain; the caller gets the attempts so the UI can explain what happened.
 */
export async function searchWithFallback(
  settings: AppSettings,
  question: string,
  options: { limit?: number } = {},
): Promise<SearchOutcome> {
  const limit = Math.min(Math.max(options.limit ?? DEFAULT_LIMIT, 1), 20);
  const order = buildOrder(settings);
  if (!order.length) return { results: [], attempts: [] };

  const key = cacheKey(question, settings, order, limit);
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
    return cached.outcome;
  }

  const entries: ChainEntry[] = order.map((name) => ({
    name,
    provider: createSearchProvider(name, settings),
  }));

  const outcome = await runSearchChain(question, entries, limit);

  if (outcome.results.length) {
    if (cache.size >= MAX_CACHE_ENTRIES) {
      const oldest = Array.from(cache.entries()).sort(
        (a, b) => a[1].at - b[1].at,
      )[0];
      if (oldest) cache.delete(oldest[0]);
    }
    cache.set(key, { at: Date.now(), outcome });
  }

  return outcome;
}
