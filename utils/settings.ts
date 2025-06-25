// Settings management for Study Buddy
// Handles both localStorage (frontend) and runtime (backend) settings

export interface AppSettings {
  llmProvider: string;
  llmApiKey: string;
  llmBaseUrl: string;
  llmModel: string;
  searchEngine: string;
  searchApiKey: string;
  searchUrl: string;
  defaultEducationLevel: string;
}

export const DEFAULT_SETTINGS: AppSettings = {
  llmProvider: "ollama",
  llmApiKey: "",
  llmBaseUrl: "http://localhost:11434",
  llmModel: "llama3.1:8b",
  searchEngine: "duckduckgo",
  searchApiKey: "",
  searchUrl: "",
  defaultEducationLevel: "Middle School",
};

let runtimeSettings: AppSettings | null = null;

export function getSettings(): AppSettings {
  // Return runtime settings if available (from frontend)
  if (runtimeSettings) {
    console.log('Using runtime settings:', runtimeSettings.llmProvider);
    return runtimeSettings;
  }

  console.log('No runtime settings, using environment variables');
  
  // Fallback to environment variables
  const provider = process.env.LLM_PROVIDER || DEFAULT_SETTINGS.llmProvider;
  
  const settings = {
    llmProvider: provider,
    llmApiKey: getProviderApiKey(provider),
    llmBaseUrl: getProviderBaseUrl(provider),
    llmModel: getProviderModel(provider),
    searchEngine: process.env.SEARCH_ENGINE || DEFAULT_SETTINGS.searchEngine,
    searchApiKey: getSearchApiKey(),
    searchUrl: process.env.SEARXNG_URL || DEFAULT_SETTINGS.searchUrl,
    defaultEducationLevel: process.env.DEFAULT_EDUCATION_LEVEL || DEFAULT_SETTINGS.defaultEducationLevel,
  };
  
  console.log('Environment-based settings:', { 
    provider: settings.llmProvider, 
    baseUrl: settings.llmBaseUrl 
  });
  
  return settings;
}

export function updateSettings(newSettings: AppSettings) {
  runtimeSettings = { ...newSettings };
  console.log('Settings updated:', { provider: newSettings.llmProvider, hasApiKey: !!newSettings.llmApiKey });
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

function getProviderBaseUrl(provider: string): string {
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