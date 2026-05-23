import { z } from "zod";
import { SearchConfig, SearchProvider, SearchResult } from "./types";

const BingSchema = z.object({
  webPages: z.object({
    value: z.array(z.object({ name: z.string(), url: z.string() })),
  }),
});

export class BingSearch implements SearchProvider {
  name = "bing";
  constructor(private config: SearchConfig) {}

  async search(question: string): Promise<SearchResult[]> {
    const apiKey = this.config.apiKey;
    if (!apiKey) throw new Error("BING_API_KEY is required");

    const params = new URLSearchParams({
      q: `${question} ${this.config.excludedSites.map((s) => `-site:${s}`).join(" ")}`,
      mkt: "en-US",
      count: "6",
      safeSearch: "Strict",
    });

    const response = await fetch(
      `https://api.bing.microsoft.com/v7.0/search?${params}`,
      { method: "GET", headers: { "Ocp-Apim-Subscription-Key": apiKey } },
    );

    const data = BingSchema.parse(await response.json());
    return data.webPages.value.map((r) => ({ name: r.name, url: r.url }));
  }
}
