import { OllamaProvider } from "./ollama";
import { TogetherProvider } from "./together";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GroqProvider } from "./groq";
import { GoogleProvider } from "./google";
import { LLMProvider, ProviderConfig } from "./types";
import { AppSettings, loadSettings } from "../settings";

export * from "./types";
export { OllamaProvider } from "./ollama";
export { TogetherProvider } from "./together";
export { OpenAIProvider } from "./openai";
export { AnthropicProvider } from "./anthropic";
export { GroqProvider } from "./groq";
export { GoogleProvider } from "./google";

export function createProvider(settings?: AppSettings): LLMProvider {
  // Fall back to environment-derived settings when none are passed.
  const resolved = settings ?? loadSettings();
  const config: ProviderConfig = {
    name: resolved.llmProvider,
    apiKey: resolved.llmApiKey,
    baseUrl: resolved.llmBaseUrl,
    defaultModel: resolved.llmModel,
  };

  switch (config.name.toLowerCase()) {
    case "ollama":
      return new OllamaProvider(config.baseUrl, config.apiKey);
    case "together":
      if (!config.apiKey) {
        throw new Error("Together AI requires an API key");
      }
      return new TogetherProvider(config.apiKey, config.baseUrl);
    case "openai":
      if (!config.apiKey) {
        throw new Error("OpenAI requires an API key");
      }
      return new OpenAIProvider(config.apiKey, config.baseUrl);
    case "anthropic":
    case "claude":
      if (!config.apiKey) {
        throw new Error("Anthropic requires an API key");
      }
      return new AnthropicProvider(config.apiKey, config.baseUrl);
    case "openrouter":
      if (!config.apiKey) {
        throw new Error("OpenRouter requires an API key");
      }
      return new OpenAIProvider(config.apiKey, config.baseUrl || "https://openrouter.ai");
    case "groq":
      if (!config.apiKey) {
        throw new Error("Groq requires an API key");
      }
      return new GroqProvider(config.apiKey, config.baseUrl);
    case "google":
    case "gemini":
      if (!config.apiKey) {
        throw new Error("Google requires an API key");
      }
      return new GoogleProvider(config.apiKey, config.baseUrl);
    default:
      throw new Error(`Unsupported provider: ${config.name}`);
  }
}

// Per-provider environment defaults now live in utils/settings.ts (loadSettings).