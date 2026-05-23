import { z } from "zod";
import { SearchConfig, SearchProvider, SearchResult } from "./types";

const SerperSchema = z.object({
  organic: z.array(z.object({ title: z.string(), link: z.string() })),
});

export class SerperSearch implements SearchProvider {
  name = "serper";
  constructor(private config: SearchConfig) {}

  async search(question: string): Promise<SearchResult[]> {
    const apiKey = this.config.apiKey;
    if (!apiKey) throw new Error("SERPER_API_KEY is required");

    const response = await fetch("https://google.serper.dev/search", {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ q: question, num: 9 }),
    });

    const data = SerperSchema.parse(await response.json());
    return data.organic.map((r) => ({ name: r.title, url: r.link }));
  }
}
