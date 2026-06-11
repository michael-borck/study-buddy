// Session preparation — the study pipeline behind one interface.
//
// prepareSession turns a topic (+ optional notes and settings) into everything
// the chat needs to start: the web sources found, the parsed content fitted to
// the context budget, the notes (summarised if they were long), and the system
// prompt. Step progress is reported through the onStep callback so the React
// page stays presentational.
//
// buildSessionPrompt is the single prompt builder. Both the initial preparation
// and mid-session strategy/nudge changes go through it, fed the *processed*
// notes — so a strategy change can never revert to un-summarised notes.

import { getSystemPrompt } from "./utils";
import { getStrategyById, nudgePrompt } from "./strategies";
import { AppSettings } from "./settings";

export type PrepStep = {
  label: string;
  status: "waiting" | "active" | "done" | "skipped" | "failed";
};

export type Source = { name: string; url: string };
export type ParsedSource = Source & { fullContent: string };

export interface PrepareSessionInput {
  topic: string;
  notes: string; // raw student notes
  ageGroup: string;
  strategyId: string;
  nudge: boolean;
  searchWeb: boolean; // landing-page toggle
  settings: AppSettings; // searchEngine + contextSize
}

export interface PreparedSession {
  sources: Source[]; // search results (for attribution)
  content: ParsedSource[]; // parsed + budget-fitted teaching material
  processedNotes: string; // notes, summarised if they were long
  systemPrompt: string;
}

// Content budgets by context-size setting (chars). Leaves room for the system
// prompt (~2K), strategy (~1K), and the conversation.
const CONTENT_BUDGETS: Record<string, number> = {
  small: 15000, //  ~4K tokens — fits 8K context models
  medium: 60000, // ~15K tokens — fits 32K context models
  large: 300000, // ~75K tokens — fits 128K+ context models
};

/**
 * The single system-prompt builder. Uses the parsed content and the *processed*
 * notes; falls back to a no-source prompt when neither is present. Strategy and
 * nudge are always reflected.
 */
export function buildSessionPrompt(args: {
  content: { fullContent: string }[];
  notes: string;
  ageGroup: string;
  strategyId: string;
  nudge: boolean;
}): string {
  const strategy = getStrategyById(args.strategyId);
  const nudgeText = args.nudge ? nudgePrompt : undefined;
  const hasContent = args.content.length > 0 || args.notes.length > 0;

  if (hasContent) {
    return getSystemPrompt(
      args.content,
      args.ageGroup,
      args.notes || undefined,
      strategy.prompt,
      nudgeText,
    );
  }

  return `You are a professional interactive personal tutor. The student wants to learn about a topic at a ${args.ageGroup} level. You don't have specific source material for this topic, so teach from your own knowledge. Be upfront that you're teaching from general knowledge and may not have the latest information. Start by greeting the learner, giving a short overview, and asking what they want to learn about (in markdown numbers). Be interactive. Keep the first message short and concise. Please return answers in markdown.\n\n${strategy.prompt}${nudgeText ? "\n\n" + nudgeText : ""}`;
}

export async function prepareSession(
  input: PrepareSessionInput,
  onStep: (steps: PrepStep[]) => void,
): Promise<PreparedSession> {
  const { topic, notes, ageGroup, strategyId, nudge, searchWeb, settings } = input;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-StudyBuddy-Settings": JSON.stringify(settings),
  };

  const shouldSearch = searchWeb && settings.searchEngine !== "disabled";

  const steps: PrepStep[] = [
    {
      label: shouldSearch ? "Searching for sources..." : "Web search off",
      status: shouldSearch ? "active" : "skipped",
    },
    { label: "Reading web pages...", status: "waiting" },
    { label: "Preparing your tutor...", status: "waiting" },
  ];
  // Emit a fresh copy so React sees a new reference each time.
  const emit = () => onStep(steps.map((s) => ({ ...s })));
  // Insert a transient step just before the final "Preparing" step.
  const insertBeforeFinal = (label: string): number => {
    steps.splice(steps.length - 1, 0, { label, status: "active" });
    return steps.length - 2;
  };
  emit();

  // Step 1: search
  let sources: Source[] = [];
  if (shouldSearch) {
    let searchOk = false;
    try {
      const res = await fetch("/api/getSources", {
        method: "POST",
        headers,
        body: JSON.stringify({ question: topic }),
      });
      if (res.ok) {
        sources = await res.json();
        searchOk = true;
      }
    } catch (e) {
      console.error("Search failed:", e);
    }
    if (searchOk) {
      steps[0].status = "done";
    } else {
      steps[0].status = "failed";
      steps[0].label = "Search failed — continuing without web sources";
    }
    emit();
  }

  // Step 2: parse the found pages
  let parsed: ParsedSource[] = [];
  if (sources.length > 0) {
    steps[1].status = "active";
    emit();
    let parseOk = false;
    try {
      const res = await fetch("/api/getParsedSources", {
        method: "POST",
        headers,
        body: JSON.stringify({ sources }),
      });
      if (res.ok) {
        parsed = await res.json();
        parseOk = true;
      }
    } catch (e) {
      console.error("Parsing failed:", e);
    }
    if (parseOk) {
      steps[1].status = "done";
    } else {
      steps[1].status = "failed";
      steps[1].label = "Couldn't read web pages — continuing without them";
    }
    emit();
  } else {
    steps[1].status = "skipped";
    emit();
  }

  // If nothing could be parsed, the session isn't actually grounded in these
  // sources — don't report them for attribution.
  if (parsed.length === 0) {
    sources = [];
  }

  // ── Fit content to the context budget ──────────────────────────────
  let processedNotes = notes || "";
  const budget = CONTENT_BUDGETS[settings.contextSize] || CONTENT_BUDGETS.small;
  const sourcesSize = () => parsed.reduce((sum, s) => sum + (s.fullContent?.length || 0), 0);
  const contentSize = () => sourcesSize() + processedNotes.length;

  // A: summarise web sources if over budget
  if (contentSize() > budget && parsed.length > 0) {
    const idx = insertBeforeFinal("Summarising sources to fit...");
    emit();
    try {
      const res = await fetch("/api/summariseSources", {
        method: "POST",
        headers,
        body: JSON.stringify({ sources: parsed }),
      });
      if (res.ok) parsed = await res.json();
    } catch (e) {
      console.error("Source summarisation failed:", e);
    }
    steps[idx].status = "done";
    emit();
  }

  // B: if notes alone are still too large, chunk and summarise them
  const notesBudget = budget - sourcesSize();
  if (processedNotes.length > Math.max(notesBudget, 4000)) {
    const idx = insertBeforeFinal("Your notes are long — summarising to fit...");
    emit();

    const chunkSize = 8000;
    const chunks: ParsedSource[] = [];
    for (let i = 0; i < processedNotes.length; i += chunkSize) {
      chunks.push({
        name: `Notes part ${Math.floor(i / chunkSize) + 1}`,
        url: "",
        fullContent: processedNotes.slice(i, i + chunkSize),
      });
    }

    try {
      const res = await fetch("/api/summariseSources", {
        method: "POST",
        headers,
        body: JSON.stringify({ sources: chunks }),
      });
      if (res.ok) {
        const summarised = await res.json();
        processedNotes = summarised
          .map((s: { fullContent: string }) => s.fullContent)
          .join("\n\n");
      }
    } catch (e) {
      console.error("Notes summarisation failed:", e);
    }
    steps[idx].status = "done";
    emit();
  }

  // C: if still over budget, take fewer sources
  while (contentSize() > budget && parsed.length > 3) {
    parsed = parsed.slice(0, parsed.length - 1);
  }

  // Step 3: prepare the tutor
  steps[steps.length - 1].status = "active";
  emit();

  const systemPrompt = buildSessionPrompt({
    content: parsed,
    notes: processedNotes,
    ageGroup,
    strategyId,
    nudge,
  });

  steps[steps.length - 1].status = "done";
  emit();

  return { sources, content: parsed, processedNotes, systemPrompt };
}
