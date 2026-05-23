import { describe, it, expect, vi, afterEach } from "vitest";
import { buildSessionPrompt, prepareSession } from "./session";
import { DEFAULT_SETTINGS } from "./settings";

const jsonOk = (data: unknown) => ({ ok: true, json: async () => data }) as any;

describe("buildSessionPrompt", () => {
  it("includes parsed content and notes when present", () => {
    const prompt = buildSessionPrompt({
      content: [{ fullContent: "Mitochondria are the powerhouse." }],
      notes: "student summary notes",
      ageGroup: "High School",
      strategyId: "explain",
      nudge: false,
    });
    expect(prompt).toContain("Mitochondria are the powerhouse.");
    expect(prompt).toContain("student summary notes");
    expect(prompt).toContain("High School");
  });

  it("uses the no-source fallback when there is no content, still reflecting strategy + nudge", () => {
    const prompt = buildSessionPrompt({
      content: [],
      notes: "",
      ageGroup: "College",
      strategyId: "quiz",
      nudge: true,
    });
    expect(prompt).toContain("teach from your own knowledge");
    expect(prompt).toContain("College");
    expect(prompt).toContain("Quiz"); // strategy applied
    expect(prompt).toContain("Reflection prompts"); // nudge applied
  });
});

describe("prepareSession", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("summarises long notes and feeds the summary (not the raw notes) into the prompt", async () => {
    const rawNotes = "RAWNOTE ".repeat(2500); // ~20K chars, over the small budget
    const fetchMock = vi.fn(async (url: string, init: any) => {
      if (typeof url === "string" && url.includes("/api/summariseSources")) {
        const body = JSON.parse(init.body);
        return jsonOk(body.sources.map((s: any) => ({ ...s, fullContent: "SUMMARY" })));
      }
      return jsonOk([]);
    });
    vi.stubGlobal("fetch", fetchMock);

    const steps: unknown[] = [];
    const result = await prepareSession(
      {
        topic: "cells",
        notes: rawNotes,
        ageGroup: "High School",
        strategyId: "explain",
        nudge: false,
        searchWeb: false,
        settings: { ...DEFAULT_SETTINGS, searchEngine: "disabled", contextSize: "small" },
      },
      (s) => steps.push(s),
    );

    expect(result.processedNotes).toContain("SUMMARY");
    expect(result.processedNotes).not.toContain("RAWNOTE");
    expect(result.systemPrompt).toContain("SUMMARY");
    expect(result.systemPrompt).not.toContain("RAWNOTE");
    expect(result.sources).toEqual([]);
    expect(steps.length).toBeGreaterThan(0);
    // Only the notes summarisation should have hit the network.
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not search when searchWeb is false and there are no notes", async () => {
    const fetchMock = vi.fn(async () => jsonOk([]));
    vi.stubGlobal("fetch", fetchMock);

    const result = await prepareSession(
      {
        topic: "x",
        notes: "",
        ageGroup: "College",
        strategyId: "explain",
        nudge: false,
        searchWeb: false,
        settings: { ...DEFAULT_SETTINGS, contextSize: "small" },
      },
      () => {},
    );

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.systemPrompt).toContain("teach from your own knowledge");
  });
});
