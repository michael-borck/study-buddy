import { SearchConfig, SearchProvider, SearchResult } from "./types";

// DuckDuckGo HTML scraping — free, no API key required.
export class DuckDuckGoSearch implements SearchProvider {
  name = "duckduckgo";
  constructor(private config: SearchConfig) {}

  async search(question: string): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      q: question,
      t: "h_", // lite version
      ia: "web", // web results only
    });

    const response = await fetch(`https://lite.duckduckgo.com/lite/?${params}`, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br",
        DNT: "1",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`DuckDuckGo search failed: ${response.statusText}`);
    }

    const htmlText = await response.text();
    const results: SearchResult[] = [];

    // DuckDuckGo Lite wraps result URLs in a redirect with the real URL in uddg.
    const linkRegex =
      /<a[^>]+href=["']([^"']+)["'][^>]*class=['"]result-link['"][^>]*>([^<]+)<\/a>/gi;

    for (const match of Array.from(htmlText.matchAll(linkRegex))) {
      let url = match[1];
      const title = match[2].trim();

      if (url.includes("duckduckgo.com/l/?uddg=")) {
        const uddgMatch = url.match(/uddg=([^&]+)/);
        if (uddgMatch) {
          try {
            url = decodeURIComponent(uddgMatch[1]);
          } catch {
            continue;
          }
        }
      }

      if (
        url.startsWith("http") &&
        !url.includes("/?q=") &&
        !url.includes("/settings") &&
        title.length > 10 &&
        !title.toLowerCase().includes("duckduckgo") &&
        !title.toLowerCase().includes("next page") &&
        !this.config.excludedSites.some((s) => url.includes(s))
      ) {
        results.push({ name: title.substring(0, 200), url });
        if (results.length >= 9) break;
      }
    }

    return results;
  }
}
