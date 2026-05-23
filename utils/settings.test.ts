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
