# Refactor plan — deepening study-buddy

Bottom-up plan to deepen five shallow modules into three. Generated from an architecture
review (2026-05-23). The five candidates collapse into three themes; order matters because
each phase lands on a clean interface below it.

| Theme | Candidates | Why grouped |
|-------|-----------|-------------|
| A · Settings | 3 (one schema) + 5 (header resolver) | 5 is the consumer side of 3 |
| B · Adapters | 1 (provider core) + 2 (search seam) | same pattern done twice |
| C · Orchestration | 4 (session-prep module) | calls A and B |

Recommended order: **A → C → B** (foundation first, so the orchestration in C lands on a
clean settings interface).

---

## Phase 0 · Precursor: a test runner *(optional but it's the payoff)*

No test runner exists today (no `test` script, no vitest/jest). Without it, "testable" stays
hypothetical.

- `npm i -D vitest`; add `"test": "vitest"` to scripts.
- One smoke test so the harness is real before Phases 1–3 rely on it.

If skipped, each phase still stands as a depth win — you just can't lock it with tests yet.

---

## Phase 1 · Settings (candidates 3 + 5)

**Goal:** one module owns the settings schema; routes stop copying the header ritual and stop
sharing a mutable global.

### Interface
```ts
// utils/settings.ts
export const SettingsSchema = z.object({ /* all 12 fields */ });
export type AppSettings = z.infer<typeof SettingsSchema>;
export const DEFAULT_SETTINGS: AppSettings;          // the ONE default set
export function loadSettings(): AppSettings;          // env fallback (server)
export function resolveSettings(request: Request): AppSettings;  // candidate 5
```

### Steps
1. Extend `AppSettings` with the four fields the UI already uses but the type never declared:
   `contextSize`, `voiceGender`, `autoRead`, `sttProvider`. Make it a `zod` schema (zod is
   already a dependency).
2. Collapse the three default sets into one `DEFAULT_SETTINGS`. Resolve the disagreement
   (`app/settings/page.tsx` reset uses `searchEngine: "disabled"` vs canonical `"duckduckgo"`).
3. Add `resolveSettings(request)`: parse `X-StudyBuddy-Settings`, **validate** with the schema,
   **return** a value (no global mutation).
4. Replace the duplicated ~8-line block in `getChat`, `getSources`, `summariseSources`,
   `getParsedSources` with `const settings = resolveSettings(request)`.
5. Thread settings explicitly: `createProvider(settings)` instead of reading the global. Removes
   the `runtimeSettings` module-global — important because `getChat` runs on the **edge** runtime,
   where a shared global can leak between concurrent requests.
6. Replace raw `localStorage.getItem("studybuddy-settings")` reads in `app/page.tsx` (the
   `contextSize` lookup) with a typed client helper.

### Deletes
Local `Settings` interface in `app/settings/page.tsx`; the duplicated header block ×4; the
`runtimeSettings` global + `updateSettings`.

### Test target
`resolveSettings` (valid / malformed / missing header → defaults) and schema validation. Pure,
no React, no HTTP.

---

## Phase 2 · Session preparation (candidate 4)

**Goal:** pull the pipeline out of the React handler into one deep module, and fix the
stale-prompt bug by construction.

### Interface
```ts
// utils/session.ts
export type PreparedSession = {
  sources: { name: string; url: string }[];
  content: { fullContent: string }[];   // parsed + budget-fitted
  processedNotes: string;                // summarised if it was long
  systemPrompt: string;
};
export async function prepareSession(
  input: { topic; notes; settings; strategyId; nudge },
  onStep: (steps: PrepStep[]) => void,
): Promise<PreparedSession>;
```

### Steps
1. Move `handleInitialChat`'s pipeline (≈ lines 166–348) into `prepareSession`: search → parse →
   budget-fit (summarise sources → chunk+summarise notes → drop sources) → build prompt.
2. **Merge the two prompt builders into one.** Today `buildSystemPrompt` (line 131) uses raw
   `customText` and `buildPromptWithNotes` (line 331) uses `processedCustomText`. Keep one builder
   that always takes the *processed* content.
3. Return `processedNotes` + `content`; store both on the page. Bug fix: `handleStrategyChange` /
   `handleNudgeChange` rebuild from the *stored processed* content via the same single builder, so a
   mid-session strategy change no longer reverts to un-summarised notes.
4. `onStep` callback drives `setPrepSteps` — React stays in the page; the pipeline doesn't.
5. `app/page.tsx` shrinks to: phase state, `messages`, the `handleChat` streaming loop, render.

### Test target
`prepareSession` with `fetch` stubbed — budget-fitting drops sources past the limit; prompt
contains summarised (not raw) notes. No browser.

---

## Phase 3 · Adapters (candidates 1 + 2)

**Goal:** collapse the duplicated provider stream code onto one core, then mirror the seam for
search.

### 3a · Provider core
```ts
// utils/providers/stream-core.ts
export function streamChatCompletion(opts: {
  url; headers; body;
  transport: "sse" | "lines";          // openai-family vs ollama/anthropic
  readDelta: (json: any) => string;    // the only real per-provider difference
}): Promise<ReadableStream>;            // fetch + non-200 + {text} normalise
```
- `openai` / `together` / `groq` become thin (OpenAI body + bearer header,
  `readDelta = j => j.choices[0].delta?.content`). `openrouter` already reuses `OpenAIProvider`.
- `anthropic` / `google` keep their body transform + own `readDelta`.
- **Delete `utils/TogetherAIStream.ts`** (dead — never imported).

### 3b · Search seam
```ts
// utils/search/types.ts
export interface SearchProvider { search(question: string): Promise<Source[]>; }
// utils/search/index.ts → createSearchProvider(settings)
```
- One adapter per engine (`bing`, `serper`, `searxng`, `duckduckgo`, `brave`). SearXNG's
  rate-limit + retry lives inside its adapter.
- `app/api/getSources/route.ts` (465 lines) shrinks to: `resolveSettings` → `createSearchProvider`
  → `search` → return; `disabled` → `[]`. Shared bits (exclusion list, `what is …` prefix) passed in.

### Test target
The provider core (one normalise test, reused across adapters) and an in-memory `SearchProvider`
proving the seam.

---

## The thread that ties them
Phase 1's `resolveSettings → createProvider(settings)` is what lets Phase 3a drop the global, and
Phase 2 calls all three. Bottom-up saves rework: each phase lands on a clean interface below it.
