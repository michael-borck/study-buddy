import { describe, it, expect } from "vitest";
import {
  parseSettings,
  resolveSettings,
  loadSettings,
  DEFAULT_SETTINGS,
} from "./settings";

describe("parseSettings", () => {
  it("fills missing fields with their defaults", () => {
    const s = parseSettings({ llmProvider: "openai" });
    expect(s.llmProvider).toBe("openai");
    expect(s.searchEngine).toBe(DEFAULT_SETTINGS.searchEngine);
    expect(s.autoRead).toBe(false);
    expect(s.contextSize).toBe("small");
  });

  it("migrates the retired bing engine to duckduckgo", () => {
    const s = parseSettings({ searchEngine: "bing" });
    expect(s.searchEngine).toBe("duckduckgo");
  });

  it("migrates a legacy single search key to the selected provider", () => {
    expect(
      parseSettings({ searchEngine: "brave", searchApiKey: "brave-key" })
        .braveApiKey,
    ).toBe("brave-key");
    expect(
      parseSettings({ searchEngine: "serper", searchApiKey: "serper-key" })
        .serperApiKey,
    ).toBe("serper-key");
  });

  it("treats masked keys as absent", () => {
    const s = parseSettings({
      searchEngine: "brave",
      braveApiKey: "***",
      serperApiKey: "***",
    });
    expect(s.braveApiKey).toBe("");
    expect(s.serperApiKey).toBe("");
  });

  it("defaults automatic fallback on with the Brave-first order", () => {
    const s = parseSettings({});
    expect(s.searchFallbackEnabled).toBe(true);
    expect(s.searchFallbackOrder).toBe("brave,serper,searxng,duckduckgo");
  });

  it("strips unknown keys", () => {
    const s = parseSettings({ llmModel: "x", bogus: 1 } as Record<string, unknown>);
    expect(s.llmModel).toBe("x");
    expect((s as Record<string, unknown>).bogus).toBeUndefined();
  });

  it("throws on a wrong field type", () => {
    expect(() => parseSettings({ autoRead: "nope" })).toThrow();
  });

  it("derives DEFAULT_SETTINGS from the schema (one default set)", () => {
    expect(DEFAULT_SETTINGS.searchEngine).toBe("duckduckgo");
    expect(parseSettings({})).toEqual(DEFAULT_SETTINGS);
  });
});

describe("resolveSettings", () => {
  const req = (header?: string) =>
    new Request("http://localhost/api", {
      headers: header ? { "X-StudyBuddy-Settings": header } : {},
    });

  it("uses a valid settings header", () => {
    const s = resolveSettings(
      req(JSON.stringify({ llmProvider: "groq", llmModel: "llama" })),
    );
    expect(s.llmProvider).toBe("groq");
    expect(s.llmModel).toBe("llama");
  });

  it("falls back to env defaults on a malformed header", () => {
    const s = resolveSettings(req("{ not json"));
    expect(s.llmProvider).toBe(loadSettings().llmProvider);
  });

  it("falls back to env defaults when the header is missing", () => {
    expect(resolveSettings(req())).toEqual(loadSettings());
  });
});
