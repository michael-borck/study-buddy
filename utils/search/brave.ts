import { z } from "zod";
import { SearchConfig, SearchProvider, SearchResult } from "./types";

const BraveSchema = z.object({
  web: z.object({
    results: z.array(z.object({ title: z.string(), url: z.string() })),
  }),
});

export class BraveSearch implements SearchProvider {
  name = "brave";
  constructor(private config: SearchConfig) {}

  async search(question: string): Promise<SearchResult[]> {
    const apiKey = this.config.apiKey;
    if (!apiKey) throw new Error("Brave Search API key is required");

    const params = new URLSearchParams({
      q: question,
      count: "9",
      text_decorations: "false",
      search_lang: "en",
      country: "US",
      safesearch: "moderate",
    });

    const response = await fetch(
      `https://api.search.brave.com/res/v1/web/search?${params}`,
      {
        method: "GET",
        headers: {
          "X-Subscription-Token": apiKey,
          Accept: "application/json",
          "User-Agent": "StudyBuddy/1.0",
        },
        signal: AbortSignal.timeout(10000),
      },
    );

    if (!response.ok) {
      throw new Error(`Brave Search failed: ${response.status} ${response.statusText}`);
    }

    const data = BraveSchema.parse(await response.json());
    return data.web.results
      .filter((r) => !this.config.excludedSites.some((s) => r.url.includes(s)))
      .slice(0, 9)
      .map((r) => ({ name: r.title, url: r.url }));
  }
}
