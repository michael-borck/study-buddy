import { OllamaProvider } from "./ollama";
import { TogetherProvider } from "./together";
import { OpenAIProvider } from "./openai";
import { AnthropicProvider } from "./anthropic";
import { GroqProvider } from "./groq";
import { GoogleProvider } from "./google";
import { LLMProvider, ProviderConfig } from "./types";
import { getSettings } from "../settings";

export * from "./types";
export { OllamaProvider } from "./ollama";
export { TogetherProvider } from "./together";
export { OpenAIProvider } from "./openai";
export { AnthropicProvider } from "./anthropic";
export { GroqProvider } from "./groq";
export { GoogleProvider } from "./google";

export function createProvider(config?: ProviderConfig): LLMProvider {
  // Use runtime settings if no config provided
  if (!config) {
    const settings = getSettings();
    config = {
      name: settings.llmProvider,
      apiKey: settings.llmApiKey,
      baseUrl: settings.llmBaseUrl,
      defaultModel: settings.llmModel,
    };
  }

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

export function getDefaultProviderConfig(): ProviderConfig {
  // Default to Ollama for local development
  const provider = process.env.LLM_PROVIDER || "ollama";
  
  switch (provider.toLowerCase()) {
    case "ollama":
      return {
        name: "ollama",
        baseUrl: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
        defaultModel: process.env.OLLAMA_MODEL || "llama3.1:8b",
      };
    case "together":
      return {
        name: "together",
        apiKey: process.env.TOGETHER_API_KEY,
        baseUrl: process.env.TOGETHER_BASE_URL || "https://api.together.xyz",
        defaultModel: process.env.TOGETHER_MODEL || "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
      };
    case "openai":
      return {
        name: "openai",
        apiKey: process.env.OPENAI_API_KEY,
        baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com",
        defaultModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
      };
    case "anthropic":
    case "claude":
      return {
        name: "anthropic",
        apiKey: process.env.ANTHROPIC_API_KEY,
        baseUrl: process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com",
        defaultModel: process.env.ANTHROPIC_MODEL || "claude-3-5-haiku-20241022",
      };
    case "groq":
      return {
        name: "groq",
        apiKey: process.env.GROQ_API_KEY,
        baseUrl: process.env.GROQ_BASE_URL || "https://api.groq.com/openai",
        defaultModel: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      };
    case "google":
    case "gemini":
      return {
        name: "google",
        apiKey: process.env.GOOGLE_API_KEY,
        baseUrl: process.env.GOOGLE_BASE_URL || "https://generativelanguage.googleapis.com",
        defaultModel: process.env.GOOGLE_MODEL || "gemini-1.5-flash",
      };
    default:
      // Fallback to Ollama
      return {
        name: "ollama",
        baseUrl: "http://localhost:11434",
        defaultModel: "llama3.1:8b",
      };
  }
}