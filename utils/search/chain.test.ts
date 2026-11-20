import { describe, expect, it } from "vitest";
import { normaliseFallbackOrder, runSearchChain, type ChainEntry } from "./chain";
import type { SearchProvider, SearchResult } from "./types";

function provider(
  name: string,
  search: SearchProvider["search"],
): SearchProvider {
  return { name, search };
}

function result(name: string, url: string): SearchResult {
  return { name, url };
}

describe("normaliseFallbackOrder", () => {
  it("lowercases, removes unknown names and deduplicates", () => {
    expect(
      normaliseFallbackOrder(" Brave, serper, brave, nope, searxng "),
    ).toBe("brave,serper,searxng");
  });

  it("falls back to the default order when nothing valid is left", () => {
    expect(normaliseFallbackOrder("nope")).toBe(
      "brave,serper,searxng,duckduckgo",
    );
  });
});

describe("runSearchChain", () => {
  it("falls through errors and empty providers, then stops at results", async () => {
    const calls: string[] = [];
    const entries: ChainEntry[] = [
      {
        name: "first",
        provider: provider("first", async () => {
          calls.push("first");
          throw new Error("boom");
        }),
      },
      {
        name: "second",
        provider: provider("second", async () => {
          calls.push("second");
          return [];
        }),
      },
      {
        name: "third",
        provider: provider("third", async () => {
          calls.push("third");
          return [result("Third", "https://example.com/third")];
        }),
      },
      {
        name: "fourth",
        provider: provider("fourth", async () => {
          calls.push("fourth");
          return [result("Fourth", "https://example.com/fourth")];
        }),
      },
    ];

    const outcome = await runSearchChain("query", entries, 5);

    expect(calls).toEqual(["first", "second", "third"]);
    expect(outcome.results).toHaveLength(1);
    expect(outcome.results[0].provider).toBe("third");
    expect(outcome.attempts.map((a) => a.status)).toEqual([
      "error",
      "empty",
      "ok",
    ]);
  });

  it("reports unconfigured providers as skipped", async () => {
    const outcome = await runSearchChain(
      "query",
      [{ name: "brave", provider: null }],
      3,
    );

    expect(outcome.results).toEqual([]);
    expect(outcome.attempts[0]).toMatchObject({
      provider: "brave",
      status: "skipped",
      reason: "not configured",
    });
  });

  it("over-fetches, filters invalid URLs and deduplicates", async () => {
    let seenLimit: number | undefined;
    const entries: ChainEntry[] = [
      {
        name: "p",
        provider: provider("p", async (_question, options) => {
          seenLimit = options?.limit;
          return [
            result("A", "https://www.example.com/a/?utm_source=newsletter"),
            result("A again", "https://example.com/a"),
            result("B", "https://example.com/b"),
            result("Broken", "not-a-url"),
          ];
        }),
      },
    ];

    const outcome = await runSearchChain("query", entries, 4);

    expect(seenLimit).toBe(8);
    expect(outcome.results).toHaveLength(2);
    expect(outcome.results.map((r) => r.url)).toEqual([
      "https://www.example.com/a/?utm_source=newsletter",
      "https://example.com/b",
    ]);
  });

  it("cools down a provider after a rate-limit error", async () => {
    let calls = 0;
    const name = `breaker-${Date.now()}-${Math.random()}`;
    const rateLimited = provider(name, async () => {
      calls += 1;
      throw new Error("429 Too Many Requests");
    });

    await runSearchChain("query", [{ name, provider: rateLimited }], 3);
    const second = await runSearchChain(
      "query",
      [{ name, provider: rateLimited }],
      3,
    );

    expect(calls).toBe(1);
    expect(second.attempts[0]).toMatchObject({
      provider: name,
      status: "skipped",
      reason: "cooling down after a rate limit",
    });
  });
});
