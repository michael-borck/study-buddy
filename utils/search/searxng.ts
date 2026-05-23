import { z } from "zod";
import { SearchConfig, SearchProvider, SearchResult } from "./types";

const SearxngSchema = z.object({
  results: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      content: z.string().optional(),
    }),
  ),
});

// ── Rate limiting (per-server + global) ──────────────────────────────
const requestTracker = new Map<string, number>();
const RATE_LIMIT_MS = 2000; // between requests to the same server
const GLOBAL_RATE_LIMIT_MS = 500; // between any two SearXNG requests
let lastGlobalRequest = 0;

async function applyRateLimit(serverKey: string) {
  const now = Date.now();
  if (now - lastGlobalRequest < GLOBAL_RATE_LIMIT_MS) {
    await sleep(GLOBAL_RATE_LIMIT_MS - (now - lastGlobalRequest));
  }

  const last = requestTracker.get(serverKey) || 0;
  const now2 = Date.now();
  if (now2 - last < RATE_LIMIT_MS) {
    await sleep(RATE_LIMIT_MS - (now2 - last));
  }

  requestTracker.set(serverKey, Date.now());
  lastGlobalRequest = Date.now();

  // Keep the tracker bounded.
  if (requestTracker.size > 50) {
    const entries = Array.from(requestTracker.entries());
    requestTracker.clear();
    entries.slice(-25).forEach(([k, t]) => requestTracker.set(k, t));
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

const REQUEST_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "application/json, text/html, application/xhtml+xml, application/xml;q=0.9, */*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br, zstd",
  Connection: "keep-alive",
  "Sec-Ch-Ua": '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Linux"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

export class SearxngSearch implements SearchProvider {
  name = "searxng";
  constructor(private config: SearchConfig) {}

  async search(question: string): Promise<SearchResult[]> {
    const baseUrl = this.config.url;
    if (!baseUrl) throw new Error("SEARXNG_URL is required when using SearXNG");

    await applyRateLimit(baseUrl);

    const params = new URLSearchParams({
      q: question,
      format: "json",
      category_general: "1",
      language: "auto",
      time_range: "",
      safesearch: "2",
      theme: "simple",
    });

    const response = await this.fetchWithFallback(baseUrl, params);

    const data = SearxngSchema.parse(await response.json());
    return data.results
      .filter((r) => !this.config.excludedSites.some((s) => r.url.includes(s)))
      .slice(0, 9)
      .map((r) => ({ name: r.title, url: r.url }));
  }

  // Try /search then /, each with exponential backoff on 429 / network errors.
  private async fetchWithFallback(
    baseUrl: string,
    params: URLSearchParams,
  ): Promise<Response> {
    const headers = { ...REQUEST_HEADERS, Referer: baseUrl };
    const endpoints = ["/search", "/"];
    let lastError: any;

    for (const endpoint of endpoints) {
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount <= maxRetries) {
        try {
          if (retryCount > 0) {
            await sleep(
              Math.min(1000 * Math.pow(2, retryCount - 1) + Math.random() * 1000, 8000),
            );
          }

          const response = await fetch(`${baseUrl}${endpoint}?${params}`, {
            method: "GET",
            headers,
            signal: AbortSignal.timeout(15000),
          });

          if (response.ok) return response;

          if (response.status === 429 && retryCount < maxRetries) {
            retryCount++;
            continue;
          }
          lastError = {
            status: response.status,
            statusText: response.statusText,
            endpoint,
          };
          break; // try next endpoint
        } catch (fetchError: any) {
          lastError = fetchError;
          if (
            retryCount < maxRetries &&
            (fetchError.name === "TimeoutError" || fetchError.code === "EAI_AGAIN")
          ) {
            retryCount++;
            continue;
          }
          break; // try next endpoint
        }
      }
    }

    throw new Error(describeFailure(baseUrl, lastError));
  }
}

function describeFailure(baseUrl: string, lastError: any): string {
  if (lastError?.status) {
    return `SearXNG server returned ${lastError.status}: ${lastError.statusText}. Tried both /search and / endpoints.`;
  }
  if (lastError?.name === "TimeoutError") {
    return "SearXNG server timeout. Please check if the server is running and accessible.";
  }
  if (lastError?.code === "EAI_AGAIN" || lastError?.code === "ENOTFOUND") {
    return `Cannot connect to SearXNG server at "${baseUrl}". Please check the URL and ensure the server is accessible.`;
  }
  const message: string = lastError?.message || "";
  if (message.includes("certificate") || message.includes("SSL") || message.includes("TLS")) {
    return `SSL/TLS certificate error connecting to "${baseUrl}". The server may have an invalid certificate.`;
  }
  if (message.includes("CORS")) {
    return `CORS error connecting to "${baseUrl}". The server may not allow cross-origin requests.`;
  }
  if (message) {
    return `SearXNG connection failed: ${message}. Tried both /search and / endpoints.`;
  }
  return "SearXNG connection failed with unknown error";
}
