// Settings management for Study Buddy.
//
// This module is the single owner of the settings schema. Three surfaces read
// through it:
//   - resolveSettings(request)   server, per-request, from the X-StudyBuddy-Settings header
//   - loadSettings()             server, fallback to environment variables
//   - loadClientSettings()       client, from localStorage
//
// Keep this module edge-safe: no Node-only imports (file persistence lives in
// utils/file-settings.js, which is required lazily by the settings route).

import { z } from "zod";

// The one schema. Every field carries its default, so DEFAULT_SETTINGS is
// derived from it — there is no second list of defaults to drift out of sync.
export const SettingsSchema = z.object({
  llmProvider: z.string().default("ollama"),
  llmApiKey: z.string().default(""),
  llmBaseUrl: z.string().default("http://localhost:11434"),
  llmModel: z.string().default("llama3.1:8b"),
  searchEngine: z.string().default("duckduckgo"),
  searchApiKey: z.string().default(""),
  searchUrl: z.string().default(""),
  defaultEducationLevel: z.string().default("Middle School"),
  contextSize: z.string().default("small"),
  voiceGender: z.string().default("female"),
  autoRead: z.boolean().default(false),
  sttProvider: z.string().default("web"),
});

export type AppSettings = z.infer<typeof SettingsSchema>;

// Parsing an empty object fills every field from its .default().
export const DEFAULT_SETTINGS: AppSettings = SettingsSchema.parse({});

// localStorage key shared by every client-side reader/writer.
export const CLIENT_SETTINGS_KEY = "studybuddy-settings";

// The education levels offered everywhere a level can be picked.
export const EDUCATION_LEVELS = [
  "Elementary School",
  "Middle School",
  "High School",
  "University",
  "Graduate",
];

// Levels stored by older versions, mapped to their current equivalent.
const LEGACY_EDUCATION_LEVELS: Record<string, string> = {
  College: "University",
  Undergrad: "University",
};

/**
 * Validate an unknown blob into AppSettings, filling any missing field with its
 * default and stripping unknown keys. Throws on type mismatch.
 */
export function parseSettings(raw: unknown): AppSettings {
  const parsed = SettingsSchema.parse(raw ?? {});
  parsed.defaultEducationLevel =
    LEGACY_EDUCATION_LEVELS[parsed.defaultEducationLevel] ??
    parsed.defaultEducationLevel;
  return parsed;
}

/**
 * Server: build settings from environment variables. Used as the fallback when
 * no per-request header (or stored file) is available.
 */
export function loadSettings(): AppSettings {
  const provider = process.env.LLM_PROVIDER || DEFAULT_SETTINGS.llmProvider;

  return parseSettings({
    llmProvider: provider,
    llmApiKey: getProviderApiKey(provider),
    llmBaseUrl: getProviderBaseUrl(provider),
    llmModel: getProviderModel(provider),
    searchEngine: process.env.SEARCH_ENGINE || DEFAULT_SETTINGS.searchEngine,
    searchApiKey: getSearchApiKey(),
    searchUrl: process.env.SEARXNG_URL || DEFAULT_SETTINGS.searchUrl,
    defaultEducationLevel:
      process.env.DEFAULT_EDUCATION_LEVEL || DEFAULT_SETTINGS.defaultEducationLevel,
  });
}

/**
 * Server: resolve the settings for one request. Prefers the validated
 * X-StudyBuddy-Settings header the frontend sends; falls back to the
 * environment. Returns a value — never mutates shared state — so concurrent
 * requests (including under the edge runtime) cannot read each other's config.
 */
export function resolveSettings(request: Request): AppSettings {
  const header = request.headers.get("X-StudyBuddy-Settings");
  if (header) {
    try {
      return parseSettings(JSON.parse(header));
    } catch (e) {
      console.warn("Invalid X-StudyBuddy-Settings header, falling back to env:", e);
    }
  }
  return loadSettings();
}

/**
 * Client: read settings from localStorage, validated and merged with defaults.
 * Returns DEFAULT_SETTINGS when unavailable or malformed.
 */
export function loadClientSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(CLIENT_SETTINGS_KEY);
    if (raw) return parseSettings(JSON.parse(raw));
  } catch (e) {
    console.warn("Invalid stored settings, using defaults:", e);
  }
  return DEFAULT_SETTINGS;
}

function getProviderApiKey(provider: string): string {
  switch (provider.toLowerCase()) {
    case "openai": return process.env.OPENAI_API_KEY || "";
    case "anthropic":
    case "claude": return process.env.ANTHROPIC_API_KEY || "";
    case "google":
    case "gemini": return process.env.GOOGLE_API_KEY || "";
    case "groq": return process.env.GROQ_API_KEY || "";
    case "together": return process.env.TOGETHER_API_KEY || "";
    case "ollama": return process.env.OLLAMA_API_KEY || "";
    default: return "";
  }
}

export function getProviderBaseUrl(provider: string): string {
  switch (provider.toLowerCase()) {
    case "ollama": return process.env.OLLAMA_BASE_URL || DEFAULT_SETTINGS.llmBaseUrl;
    case "openai": return process.env.OPENAI_BASE_URL || "https://api.openai.com";
    case "anthropic":
    case "claude": return process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
    case "google":
    case "gemini": return process.env.GOOGLE_BASE_URL || "https://generativelanguage.googleapis.com";
    case "groq": return process.env.GROQ_BASE_URL || "https://api.groq.com/openai";
    case "together": return process.env.TOGETHER_BASE_URL || "https://api.together.xyz";
    default: return "";
  }
}

function getProviderModel(provider: string): string {
  switch (provider.toLowerCase()) {
    case "ollama": return process.env.OLLAMA_MODEL || DEFAULT_SETTINGS.llmModel;
    case "openai": return process.env.OPENAI_MODEL || "gpt-4o-mini";
    case "anthropic":
    case "claude": return process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022";
    case "google":
    case "gemini": return process.env.GOOGLE_MODEL || "gemini-1.5-flash";
    case "groq": return process.env.GROQ_MODEL || "llama-3.1-8b-instant";
    case "together": return process.env.TOGETHER_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo";
    default: return "";
  }
}

function getSearchApiKey(): string {
  const searchEngine = process.env.SEARCH_ENGINE || DEFAULT_SETTINGS.searchEngine;
  switch (searchEngine.toLowerCase()) {
    case "serper": return process.env.SERPER_API_KEY || "";
    case "bing": return process.env.BING_API_KEY || "";
    case "brave": return process.env.BRAVE_API_KEY || "";
    case "duckduckgo": return ""; // DuckDuckGo doesn't need an API key
    default: return "";
  }
}
