import { z } from "zod";
import { SearchConfig, SearchOptions, SearchProvider, SearchResult } from "./types";

const SerperSchema = z.object({
  organic: z.array(
    z.object({
      title: z.string(),
      link: z.string(),
      snippet: z.string().optional(),
    }),
  ),
});

export class SerperSearch implements SearchProvider {
  name = "serper";
  constructor(private config: SearchConfig) {}

  async search(question: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    const apiKey = this.config.apiKey;
    if (!apiKey) throw new Error("SERPER_API_KEY is required");

    const requested = Math.min(Math.max(options.limit ?? 9, 1), 100);
    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: question, num: requested }),
    });

    const data = SerperSchema.parse(await response.json());
    return data.organic
      .filter((r) => !this.config.excludedSites.some((s) => r.link.includes(s)))
      .slice(0, requested)
      .map((r, i) => ({
        name: r.title,
        url: r.link,
        snippet: r.snippet,
        position: i + 1,
      }));
  }
}
